import ast
import json
import logging
import os
import re
import subprocess
import tempfile
import shutil

try:
    import resource
except ImportError:
    resource = None


logger = logging.getLogger(__name__)


# CONFIGURATION

SUPPORTED_LANGUAGES = {
    "python",
    "javascript",
    "java",
    "c",
}

MAX_CODE_LENGTH = 12000
MAX_TEST_CASES = 10
TIME_LIMIT_SECONDS = 3
MAX_OUTPUT_LENGTH = 8000
MAX_MEMORY_MB = 128


# RESULT HELPERS

def make_result(
    output="",
    error=False,
    passed=False,
):
    return {
        "output": str(output)[:MAX_OUTPUT_LENGTH],
        "error": error,
        "passed": passed,
    }


# OUTPUT COMPARISON

def compare_output(actual, expected):
    """
    Compare program output with expected output.

    First tries JSON comparison.
    Falls back to normalized string comparison.
    """

    actual = str(actual).strip()

    # Direct JSON comparison

    try:

        actual_json = json.loads(actual)

        if actual_json == expected:
            return True

        # Expected may itself be a JSON string.
        if isinstance(expected, str):

            try:

                expected_json = json.loads(
                    expected
                )

                if actual_json == expected_json:
                    return True

            except (
                json.JSONDecodeError,
                TypeError,
            ):

                pass

    except (
        json.JSONDecodeError,
        TypeError,
    ):

        pass


    # Normalized string comparison

    actual_normalized = " ".join(
        actual.split()
    )

    expected_normalized = " ".join(
        str(expected).strip().split()
    )

    return (
        actual_normalized
        ==
        expected_normalized
    )


# PYTHON CODE SAFETY CHECK

BLOCKED_PYTHON_MODULES = {
    "os",
    "sys",
    "subprocess",
    "socket",
    "pathlib",
    "shutil",
    "ctypes",
    "multiprocessing",
    "signal",
    "resource",
    "builtins",
    "importlib",
    "pickle",
    "marshal",
    "tempfile",
    "threading",
}


BLOCKED_PYTHON_CALLS = {
    "eval",
    "exec",
    "compile",
    "__import__",
    "input",
    "open",
}


BLOCKED_PYTHON_ATTRIBUTES = {
    "__class__",
    "__bases__",
    "__subclasses__",
    "__globals__",
    "__builtins__",
    "__code__",
    "__loader__",
    "__spec__",
}


def validate_python_code(code):
    """
    Basic static safety validation.

    This is NOT a complete sandbox.
    """

    try:

        tree = ast.parse(code)

    except SyntaxError as exc:

        return False, (
            f"Syntax Error: {exc}"
        )


    for node in ast.walk(tree):

        # Imports

        if isinstance(
            node,
            ast.Import,
        ):

            for alias in node.names:

                module_name = (
                    alias.name.split(".")[0]
                )

                if (
                    module_name
                    in BLOCKED_PYTHON_MODULES
                ):

                    return False, (
                        f"Import of '{module_name}' "
                        "is not allowed."
                    )


        # From imports

        elif isinstance(
            node,
            ast.ImportFrom,
        ):

            module_name = (
                node.module.split(".")[0]
                if node.module
                else ""
            )

            if (
                module_name
                in BLOCKED_PYTHON_MODULES
            ):

                return False, (
                    f"Import of '{module_name}' "
                    "is not allowed."
                )


        # Dangerous function calls

        elif isinstance(
            node,
            ast.Call,
        ):

            if isinstance(
                node.func,
                ast.Name,
            ):

                if (
                    node.func.id
                    in BLOCKED_PYTHON_CALLS
                ):

                    return False, (
                        f"Use of '{node.func.id}' "
                        "is not allowed."
                    )


        # Dangerous attributes

        elif isinstance(
            node,
            ast.Attribute,
        ):

            if (
                node.attr
                in BLOCKED_PYTHON_ATTRIBUTES
            ):

                return False, (
                    f"Access to '{node.attr}' "
                    "is not allowed."
                )


    return True, ""


# PYTHON RESOURCE LIMITS

def set_python_limits():
    """
    Apply Linux resource limits when available.

    Windows does not provide the resource module.
    """

    if resource is None:
        return


    try:

        memory_limit = (
            MAX_MEMORY_MB * 1024 * 1024
        )

        resource.setrlimit(
            resource.RLIMIT_AS,
            (
                memory_limit,
                memory_limit,
            ),
        )

    except Exception:
        pass


    try:

        resource.setrlimit(
            resource.RLIMIT_CPU,
            (
                TIME_LIMIT_SECONDS,
                TIME_LIMIT_SECONDS,
            ),
        )

    except Exception:
        pass


    try:

        max_file_size = (
            MAX_OUTPUT_LENGTH * 2
        )

        resource.setrlimit(
            resource.RLIMIT_FSIZE,
            (
                max_file_size,
                max_file_size,
            ),
        )

    except Exception:
        pass


# PYTHON CODE EXECUTION

def run_python_code(
    code,
    test_case,
):

    if len(code) > MAX_CODE_LENGTH:

        return make_result(
            "Code exceeds the maximum allowed length.",
            error=True,
        )


    # Static validation

    safe, message = validate_python_code(
        code
    )

    if not safe:

        return make_result(
            message,
            error=True,
        )


    file_path = None


    try:

        # Create temporary Python file

        with tempfile.NamedTemporaryFile(
            suffix=".py",
            mode="w",
            encoding="utf-8",
            delete=False,
        ) as file:

            file.write(
                "import json\n"
                "import sys\n\n"
            )


            file.write(
                "def main():\n"
            )


            file.write(
                "    test_input = "
                "json.loads(sys.argv[1])\n\n"
            )


            file.write(
                "    # User code\n"
            )


            for line in code.splitlines():

                file.write(
                    "    " + line + "\n"
                )


            file.write("\n")


            file.write(
                "    try:\n"
            )


            file.write(
                "        if 'result' in locals():\n"
            )


            file.write(
                "            print(json.dumps(result))\n"
            )


            file.write(
                "    except Exception as output_error:\n"
            )


            file.write(
                "        print(str(output_error))\n"
            )


            file.write("\n")


            file.write(
                "if __name__ == '__main__':\n"
            )


            file.write(
                "    main()\n"
            )


            file_path = file.name


        # Input

        input_json = json.dumps(
            test_case.get("input")
        )


        # Command

        command = [
            "python",
            file_path,
            input_json,
        ]


        process_kwargs = {
            "capture_output": True,
            "text": True,
            "timeout": TIME_LIMIT_SECONDS,
        }


        # Linux resource limits

        if resource is not None:

            process_kwargs["preexec_fn"] = (
                set_python_limits
            )


        # Execute

        process = subprocess.run(
            command,
            **process_kwargs,
        )


        output = (
            process.stdout or ""
        ).strip()


        error = (
            process.stderr or ""
        ).strip()


        # Runtime error

        if process.returncode != 0:

            return make_result(
                error
                or output
                or "Runtime Error",
                error=True,
            )


        # Compare

        expected = test_case.get(
            "expected"
        )


        passed = compare_output(
            output,
            expected,
        )


        return make_result(
            output,
            error=False,
            passed=passed,
        )


    except subprocess.TimeoutExpired:

        return make_result(
            "Code execution timed out "
            f"({TIME_LIMIT_SECONDS} seconds limit).",
            error=True,
        )


    except Exception as exc:

        logger.exception(
            "Python code execution failed."
        )


        return make_result(
            str(exc),
            error=True,
        )


    finally:

        if file_path:

            try:

                if os.path.exists(
                    file_path
                ):

                    os.remove(
                        file_path
                    )

            except Exception:
                pass


# JAVASCRIPT CODE SAFETY CHECK

BLOCKED_JS_PATTERNS = [
    "require(",
    "import ",
    "from ",
    "child_process",
    "execsync",
    "spawnsync",
    "fork(",
    "process.env",
    "process.exit",
    "fs.",
    "net.",
    "dgram",
    "http.",
    "https.",
    "cluster",
    "worker_threads",
]


def validate_javascript_code(
    code
):

    lowered = code.lower()


    for pattern in BLOCKED_JS_PATTERNS:

        if pattern.lower() in lowered:

            return False, (
                f"Use of '{pattern}' "
                "is not allowed."
            )


    return True, ""


# JAVASCRIPT CODE EXECUTION

def run_javascript_code(
    code,
    test_case,
):

    if len(code) > MAX_CODE_LENGTH:

        return make_result(
            "Code exceeds the maximum allowed length.",
            error=True,
        )


    safe, message = (
        validate_javascript_code(
            code
        )
    )


    if not safe:

        return make_result(
            message,
            error=True,
        )


    file_path = None


    try:

        # Create temporary JavaScript file

        with tempfile.NamedTemporaryFile(
            suffix=".js",
            mode="w",
            encoding="utf-8",
            delete=False,
        ) as file:

            file.write(
                "const testInput = "
                "JSON.parse(process.argv[2]);\n\n"
            )


            file.write(
                "// User code\n"
            )


            file.write(
                code
            )


            file.write(
                "\n\n"
            )


            file.write(
                "if (typeof result !== 'undefined') {\n"
            )


            file.write(
                "    console.log("
                "JSON.stringify(result)"
                ");\n"
            )


            file.write(
                "}\n"
            )


            file_path = file.name


        # Input

        input_json = json.dumps(
            test_case.get("input")
        )


        command = [
            "node",
            file_path,
            input_json,
        ]


        # Execute

        process = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=TIME_LIMIT_SECONDS,
        )


        output = (
            process.stdout or ""
        ).strip()


        error = (
            process.stderr or ""
        ).strip()


        # Runtime error

        if process.returncode != 0:

            return make_result(
                error
                or output
                or "Runtime Error",
                error=True,
            )


        # Compare

        expected = test_case.get(
            "expected"
        )


        passed = compare_output(
            output,
            expected,
        )


        return make_result(
            output,
            error=False,
            passed=passed,
        )


    except subprocess.TimeoutExpired:

        return make_result(
            "Code execution timed out "
            f"({TIME_LIMIT_SECONDS} seconds limit).",
            error=True,
        )


    except FileNotFoundError:

        return make_result(
            "Node.js is not installed or "
            "is not available in PATH.",
            error=True,
        )


    except Exception as exc:

        logger.exception(
            "JavaScript code execution failed."
        )


        return make_result(
            str(exc),
            error=True,
        )


    finally:

        if file_path:

            try:

                if os.path.exists(
                    file_path
                ):

                    os.remove(
                        file_path
                    )

            except Exception:
                pass


# JAVA CODE SAFETY CHECK

BLOCKED_JAVA_PATTERNS = [
    "runtime.getruntime",
    "processbuilder",
    "java.lang.runtime",
    "system.getenv",
    "system.setproperty",
    "files.",
    "paths.",
    "fileinputstream",
    "fileoutputstream",
    "socket",
    "serversocket",
    "url.openconnection",
    "class.forname",
    "reflection",
    "securitymanager",
]


def validate_java_code(
    code
):

    lowered = code.lower()


    for pattern in BLOCKED_JAVA_PATTERNS:

        if pattern in lowered:

            return False, (
                f"Use of '{pattern}' "
                "is not allowed."
            )


    return True, ""


# JAVA CLASS NAME HANDLER

def normalize_java_code(
    code
):
    """
    Career Compass expects the Java solution
    to use a class named Main.

    If the user uses:

        public class Main

    everything is fine.

    If they use another public class name,
    the submission is rejected rather than
    modifying their program.
    """

    public_classes = re.findall(
        r"\bpublic\s+class\s+([A-Za-z_][A-Za-z0-9_]*)",
        code,
    )


    for class_name in public_classes:

        if class_name != "Main":

            return False, (
                "Java solution must use "
                "public class Main."
            )


    return True, ""


# JAVA CODE EXECUTION

def run_java_code(
    code,
    test_case,
):

    if len(code) > MAX_CODE_LENGTH:

        return make_result(
            "Code exceeds the maximum allowed length.",
            error=True,
        )


    # Safety validation

    safe, message = validate_java_code(
        code
    )


    if not safe:

        return make_result(
            message,
            error=True,
        )


    # Class validation

    safe, message = normalize_java_code(
        code
    )


    if not safe:

        return make_result(
            message,
            error=True,
        )


    temp_dir = None


    try:

        # Check Java installation

        javac_path = shutil.which(
            "javac"
        )

        java_path = shutil.which(
            "java"
        )


        if (
            not javac_path
            or not java_path
        ):

            return make_result(
                "Java/Javac is not installed "
                "or is not available in PATH.",
                error=True,
            )


        # Temporary directory

        temp_dir = tempfile.mkdtemp(
            prefix="career_compass_java_"
        )


        file_path = os.path.join(
            temp_dir,
            "Main.java",
        )


        # Java source

        with open(
            file_path,
            "w",
            encoding="utf-8",
        ) as file:

            file.write(
                "import java.util.*;\n"
            )

            file.write(
                "import java.io.*;\n\n"
            )

            file.write(
                code
            )

            file.write(
                "\n"
            )


        # Compile

        compile_process = subprocess.run(
            [
                javac_path,
                "-encoding",
                "UTF-8",
                file_path,
            ],
            capture_output=True,
            text=True,
            timeout=TIME_LIMIT_SECONDS,
            cwd=temp_dir,
        )


        if (
            compile_process.returncode
            != 0
        ):

            return make_result(
                compile_process.stderr
                or "Java compilation error.",
                error=True,
            )


        # Input

        input_json = json.dumps(
            test_case.get("input")
        )


        # Run

        process = subprocess.run(
            [
                java_path,
                "-cp",
                temp_dir,
                "Main",
                input_json,
            ],
            capture_output=True,
            text=True,
            timeout=TIME_LIMIT_SECONDS,
            cwd=temp_dir,
        )


        output = (
            process.stdout or ""
        ).strip()


        error = (
            process.stderr or ""
        ).strip()


        # Runtime error

        if process.returncode != 0:

            return make_result(
                error
                or output
                or "Java Runtime Error",
                error=True,
            )


        # Compare

        expected = test_case.get(
            "expected"
        )


        passed = compare_output(
            output,
            expected,
        )


        return make_result(
            output,
            error=False,
            passed=passed,
        )


    except subprocess.TimeoutExpired:

        return make_result(
            "Java execution timed out "
            f"({TIME_LIMIT_SECONDS} seconds limit).",
            error=True,
        )


    except Exception as exc:

        logger.exception(
            "Java code execution failed."
        )


        return make_result(
            str(exc),
            error=True,
        )


    finally:

        if temp_dir:

            try:

                shutil.rmtree(
                    temp_dir,
                    ignore_errors=True,
                )

            except Exception:
                pass


# C CODE SAFETY CHECK

BLOCKED_C_PATTERNS = [
    "#include <windows.h>",
    "#include <sys/",
    "#include <unistd.h>",
    "#include <dirent.h>",
    "#include <netinet/",
    "#include <arpa/",
    "#include <sys/socket.h>",
    "system(",
    "popen(",
    "fork(",
    "exec(",
    "execl(",
    "execv(",
    "execvp(",
    "remove(",
    "rename(",
    "fopen(",
]


def validate_c_code(
    code
):

    lowered = code.lower()


    for pattern in BLOCKED_C_PATTERNS:

        if pattern.lower() in lowered:

            return False, (
                f"Use of '{pattern}' "
                "is not allowed."
            )


    return True, ""


# C CODE EXECUTION

def run_c_code(
    code,
    test_case,
):

    if len(code) > MAX_CODE_LENGTH:

        return make_result(
            "Code exceeds the maximum allowed length.",
            error=True,
        )


    # Safety validation

    safe, message = validate_c_code(
        code
    )


    if not safe:

        return make_result(
            message,
            error=True,
        )


    # Check GCC

    gcc_path = shutil.which(
        "gcc"
    )


    if not gcc_path:

        return make_result(
            "GCC is not installed or "
            "is not available in PATH.",
            error=True,
        )


    temp_dir = None


    try:

        # Temporary directory

        temp_dir = tempfile.mkdtemp(
            prefix="career_compass_c_"
        )


        source_path = os.path.join(
            temp_dir,
            "main.c",
        )


        executable_name = (
            "main.exe"
            if os.name == "nt"
            else "main"
        )


        executable_path = os.path.join(
            temp_dir,
            executable_name,
        )


        # Write C source

        with open(
            source_path,
            "w",
            encoding="utf-8",
        ) as file:

            file.write(
                "#include <stdio.h>\n"
                "#include <stdlib.h>\n"
                "#include <string.h>\n"
                "#include <math.h>\n\n"
            )


            file.write(
                code
            )


            file.write(
                "\n"
            )


        # Compile

        compile_process = subprocess.run(
            [
                gcc_path,
                source_path,
                "-o",
                executable_path,
            ],
            capture_output=True,
            text=True,
            timeout=TIME_LIMIT_SECONDS,
            cwd=temp_dir,
        )


        if (
            compile_process.returncode
            != 0
        ):

            return make_result(
                compile_process.stderr
                or "C compilation error.",
                error=True,
            )


        # Test input

        test_input = test_case.get(
            "input"
        )


        if test_input is None:

            stdin_data = ""


        elif isinstance(
            test_input,
            str,
        ):

            stdin_data = test_input


        else:

            stdin_data = json.dumps(
                test_input
            )


        # Run executable

        process = subprocess.run(
            [executable_path],
            input=stdin_data,
            capture_output=True,
            text=True,
            timeout=TIME_LIMIT_SECONDS,
            cwd=temp_dir,
        )


        output = (
            process.stdout or ""
        ).strip()


        error = (
            process.stderr or ""
        ).strip()


        # Runtime error

        if process.returncode != 0:

            return make_result(
                error
                or output
                or "C Runtime Error",
                error=True,
            )


        # Compare

        expected = test_case.get(
            "expected"
        )


        passed = compare_output(
            output,
            expected,
        )


        return make_result(
            output,
            error=False,
            passed=passed,
        )


    except subprocess.TimeoutExpired:

        return make_result(
            "C execution timed out "
            f"({TIME_LIMIT_SECONDS} seconds limit).",
            error=True,
        )


    except Exception as exc:

        logger.exception(
            "C code execution failed."
        )


        return make_result(
            str(exc),
            error=True,
        )


    finally:

        if temp_dir:

            try:

                shutil.rmtree(
                    temp_dir,
                    ignore_errors=True,
                )

            except Exception:
                pass


# MAIN COMPILER

def compile_and_run(
    code,
    language,
    test_cases,
):

    language = (
        language or ""
    ).strip().lower()


    code = code or ""


    # LANGUAGE VALIDATION

    if language not in SUPPORTED_LANGUAGES:

        return {
            "results": [],
            "passed": False,
            "total_tests": 0,
            "passed_tests": 0,
            "error": True,
            "message": (
                f"Language '{language}' "
                "is not supported."
            ),
        }


    # CODE LENGTH

    if len(code) > MAX_CODE_LENGTH:

        return {
            "results": [],
            "passed": False,
            "total_tests": 0,
            "passed_tests": 0,
            "error": True,
            "message": (
                "Code exceeds the maximum "
                "allowed length."
            ),
        }


    # EMPTY CODE

    if not code.strip():

        return {
            "results": [],
            "passed": False,
            "total_tests": 0,
            "passed_tests": 0,
            "error": True,
            "message": (
                "Code cannot be empty."
            ),
        }


    # TEST CASES

    if not test_cases:

        return {
            "results": [],
            "passed": False,
            "total_tests": 0,
            "passed_tests": 0,
            "error": True,
            "message": (
                "No test cases provided."
            ),
        }


    test_cases = test_cases[
        :MAX_TEST_CASES
    ]


    results = []

    all_passed = True


    # EXECUTE TEST CASES

    for index, test_case in enumerate(
        test_cases,
        start=1,
    ):

        if not isinstance(
            test_case,
            dict,
        ):

            test_case = {
                "input": test_case,
                "expected": "",
            }


        # PYTHON

        if language == "python":

            result = run_python_code(
                code,
                test_case,
            )


        # JAVASCRIPT

        elif language == "javascript":

            result = run_javascript_code(
                code,
                test_case,
            )


        # JAVA

        elif language == "java":

            result = run_java_code(
                code,
                test_case,
            )


        # C

        elif language == "c":

            result = run_c_code(
                code,
                test_case,
            )


        # FALLBACK

        else:

            result = make_result(
                f"Language '{language}' "
                "is not supported.",
                error=True,
            )


        result["test_case"] = index

        results.append(
            result
        )


        if not result.get(
            "passed",
            False,
        ):

            all_passed = False


    # FINAL RESULT

    return {
        "results": results,

        "passed": all_passed,

        "total_tests": len(
            results
        ),

        "passed_tests": sum(
            1
            for result in results
            if result.get("passed")
        ),

        "error": False,
    }