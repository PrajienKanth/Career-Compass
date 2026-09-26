// Career Compass - Charts and Data Visualization

function initSkillCharts() {
    const skillItems = document.querySelectorAll('.skill-item');
    if (skillItems.length === 0) return;

    skillItems.forEach(item => {
        const skillName = item.querySelector('.skill-name').innerText;
        const skillValue = parseInt(item.getAttribute('data-value'));
        const skillMax = parseInt(item.getAttribute('data-max') || 5);
        
        const progressBar = item.querySelector('.skill-progress');
        if (progressBar) {
            const progressPercent = (skillValue / skillMax) * 100;
            progressBar.style.width = progressPercent + '%';
        }
    });
}

function initRadarChart() {
    const radarChartCanvas = document.getElementById('skills-radar-chart');
    if (!radarChartCanvas) return;

    // Get skills data from the page
    const skillItems = document.querySelectorAll('.skill-item');
    if (skillItems.length === 0) return;

    const skillLabels = [];
    const skillValues = [];

    skillItems.forEach(item => {
        const skillName = item.querySelector('.skill-name').innerText;
        const skillValue = parseInt(item.getAttribute('data-value'));
        skillLabels.push(skillName);
        skillValues.push(skillValue);
    });

    // Create radar chart
    const radarChart = new Chart(radarChartCanvas, {
        type: 'radar',
        data: {
            labels: skillLabels,
            datasets: [{
                label: 'Skills',
                data: skillValues,
                backgroundColor: 'rgba(76, 110, 245, 0.2)',
                borderColor: 'rgba(76, 110, 245, 1)',
                pointBackgroundColor: 'rgba(76, 110, 245, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(76, 110, 245, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            family: "'Poppins', sans-serif"
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 5
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14,
                        family: "'Poppins', sans-serif"
                    },
                    bodyFont: {
                        size: 14,
                        family: "'Poppins', sans-serif"
                    },
                    displayColors: false
                }
            }
        }
    });
}

function initAptitudeChart() {
    const aptitudeChartCanvas = document.getElementById('aptitude-results-chart');
    if (!aptitudeChartCanvas) return;

    // Get aptitude data from the page
    const aptitudeItems = document.querySelectorAll('.aptitude-result-item');
    if (aptitudeItems.length === 0) return;

    const testLabels = [];
    const testScores = [];
    const testMaxScores = [];

    aptitudeItems.forEach(item => {
        const testType = item.getAttribute('data-test-type');
        const score = parseInt(item.getAttribute('data-score'));
        const maxScore = parseInt(item.getAttribute('data-max-score'));
        
        testLabels.push(testType.charAt(0).toUpperCase() + testType.slice(1));
        testScores.push(score);
        testMaxScores.push(maxScore);
    });

    // Create bar chart
    const aptitudeChart = new Chart(aptitudeChartCanvas, {
        type: 'bar',
        data: {
            labels: testLabels,
            datasets: [
                {
                    label: 'Your Score',
                    data: testScores,
                    backgroundColor: 'rgba(76, 110, 245, 0.7)',
                    borderColor: 'rgba(76, 110, 245, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Maximum Score',
                    data: testMaxScores,
                    backgroundColor: 'rgba(173, 181, 189, 0.3)',
                    borderColor: 'rgba(173, 181, 189, 0.7)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14,
                        family: "'Poppins', sans-serif"
                    },
                    bodyFont: {
                        size: 14,
                        family: "'Poppins', sans-serif"
                    }
                }
            }
        }
    });
}

function initCourseProgressChart() {
    const courseProgressCanvas = document.getElementById('course-progress-chart');
    if (!courseProgressCanvas) return;

    // Create doughnut chart for course progress
    const courseProgressChart = new Chart(courseProgressCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'Saved'],
            datasets: [{
                data: [3, 2, 5],
                backgroundColor: [
                    'rgba(18, 184, 134, 0.7)',
                    'rgba(76, 110, 245, 0.7)',
                    'rgba(173, 181, 189, 0.5)'
                ],
                borderColor: [
                    'rgba(18, 184, 134, 1)',
                    'rgba(76, 110, 245, 1)',
                    'rgba(173, 181, 189, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14,
                        family: "'Poppins', sans-serif"
                    },
                    bodyFont: {
                        size: 14,
                        family: "'Poppins', sans-serif"
                    }
                }
            }
        }
    });
}

// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSkillCharts();
    initRadarChart();
    initAptitudeChart();
    initCourseProgressChart();
});
