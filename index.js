let pointsL = [];
let pointsN = [];

function toggleInputs() {
    const operation = document.getElementById("operation").value;
    document.getElementById("lagrangeInputs").style.display = operation === "lagrange" ? "block" : "none";
    document.getElementById("newtonInputs").style.display = operation === "newton" ? "block" : "none";
}

function resetPage() {
    location.reload(); // Menyegarkan halaman untuk mengembalikan semua input ke keadaan awal
}

function calculateLagrange() {
    const xValues = document.getElementById("xL").value.split(',').map(Number);
    const yValues = document.getElementById("yL").value.split(',').map(Number);

    const xToCalculate = parseFloat(document.getElementById("xValueL").value);

    if (xValues.length !== yValues.length) {
        displayResult("Jumlah nilai x dan y harus sama.", []);
        return;
    }

    let result = 0;

    xValues.forEach((xj, j) => {
        let term = yValues[j];

        xValues.forEach((xi, i) => {
            if (i !== j) {
                term *= (xToCalculate - xi) / (xj - xi);
            }
        });

        result += term;
    });

    displayResult(`Hasil Interpolasi Lagrange untuk x=${xToCalculate}: y=${result}`, xValues.map((val, index) => [val, yValues[index]]));
}

function calculateNewton() {
    const xValues = document.getElementById("xN").value.split(',').map(Number);
    const fXValues = document.getElementById("fXN").value.split(',').map(Number);

    const interpX = parseFloat(document.getElementById("interpX").value);

    if (xValues.length !== fXValues.length) {
        displayResult("Jumlah nilai x dan f(x) harus sama.", []);
        return;
    }

    const n = xValues.length;

    let dividedDifferences = [];

    for (let i = 0; i < n; i++) {
        dividedDifferences[i] = [fXValues[i]];

        for (let j = 1; j <= i; j++) {
            const numerator = dividedDifferences[i][j - 1] - dividedDifferences[i - 1][j - 1];
            const denominator = xValues[i] - xValues[i - j];
            dividedDifferences[i].push(numerator / denominator);
        }
    }

    let result = dividedDifferences[0][0];

    for (let i = 1; i < n; i++) {
        let term = dividedDifferences[i][i];

        for (let j = 0; j < i; j++) {
            term *= (interpX - xValues[j]);
        }

        result += term;
    }

    displayResult(`Hasil Interpolasi Newton untuk x=${interpX}: f(x)=${result}`, xValues.map((val, index) => [val, fXValues[index]]));
}

function displayResult(message, points) {
    document.getElementById("output").innerText = message;

    // Menampilkan grafik
    const ctx = document.getElementById('resultChart').getContext('2d');

    const labels = points.map(p => p[0]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Data Titik',
                data: points.map(p => p[1]),
                fill: false,
                borderColor: 'rgba(255,99,132,1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
