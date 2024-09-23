//// 確保在 DOM 加載完成後執行此代碼
let myLineChart;
const ctx = document.getElementById('myLineChart').getContext('2d');
const FRsBtn = $("#FRsBtn");
document.querySelectorAll('input[name="Item"]').forEach((radio) => {
    radio.addEventListener('change', function (event) {
        if (event.target.value == "DailyFR") {
            if (myLineChart) {
                myLineChart.destroy();
                $("#CompletenessRate").val("");
            }
            document.querySelectorAll('input[name="CheckBoxItem"]').forEach(i => {
                i.checked = false;
            });
            document.querySelectorAll('input[name="CheckBoxItem"]').forEach(i => {
                i.disabled = true;
            });
            document.querySelectorAll('#FRs input').forEach(i => {
                i.disabled = false;
            });
            FRsBtn.prop("disabled", false);
        } else {
            document.querySelectorAll('input[name="CheckBoxItem"]').forEach(i => {
                i.disabled = false;
            });
            document.querySelectorAll('#FRs input').forEach(i=> {
                i.disabled = true;
                i.checked = false;
            });
            FRsBtn.prop("disabled", true);
        }
    });
});


function Search_Click() {
    const model = document.querySelector('input[name="Item"]:checked').value;
    const checkboxes = document.querySelectorAll('input[name="CheckBoxItem"]:checked');
    const checkboxValues = Array.from(checkboxes).map(checkbox => checkbox.value);
    const checkboxStrings = Array.from(checkboxes).map(checkbox => checkbox.id);
    let startTime = $("#StartTime").val();
    let endTime = $("#EndTime").val();
    if (model == "T1440") {
        //開始時間
        let startDate = new Date(startTime);
        let startYear = startDate.getFullYear();
        let startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
        let startDay = String(startDate.getDate()).padStart(2, '0');
        //結束時間
        let endDate = new Date(endTime);
        let endYear = endDate.getFullYear();
        let endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
        let endDay = String(endDate.getDate()).padStart(2, '0');
        startTime = `${startYear}-${startMonth}-${startDay}T00:00`;
        endTime = `${endYear}-${endMonth}-${endDay}T23:00`;
    }
    if (model == "DailyFR") {
        alert("流速只能匯出Excel");
        return;
    }
    if (checkboxes.length == 0) {
        alert("請勾選至少一個單位");
        return;
    }
    if (endTime < startTime) {
        alert("結束時間不得小於開始時間");
        return;
    };
    let params = {
        model,
        startTime,
        endTime,
        checkboxValues,
        checkboxStrings
    };
    fetchData(params);
}

function CreateChat(filteredData) {
    const checkboxes = document.querySelectorAll('input[name="CheckBoxItem"]:checked');
    const checkboxStrings = Array.from(checkboxes).map(checkbox => checkbox.id);
    const checkboxStrings_TW = Array.from(checkboxes).map(checkbox => checkbox.labels[0].innerText);
    let datasets = [];
    checkboxStrings.forEach(item => {
        let color = getRandomColor();
        let line = {
            tension: 0.4,
            borderColor: color,
            backgroundColor: color
        };
        let data = [];
        filteredData.forEach((i) => {
            data.push(i[item]);
        });
        line.data = data;
        datasets.push(line);
    });
    for (var i = 0; i < datasets.length; i++) {
        datasets[i].label = checkboxStrings_TW[i];
    }
    let labels = [];
    filteredData.forEach((i) => {
        labels.push(i.RecDateTime.slice(0, 16));
    });
    if (myLineChart) {
        myLineChart.destroy();
    }
    myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function fetchData(queryBody) {
    if (queryBody.model == "T1440") {
        fetch("/CpdcApi/Day", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(queryBody)
        })
            .then(response => response.json())
            .then(data => {
                CreateChat(data);
                DataCompletenessRate(data, queryBody.model);
            })
            .catch(error => {
                console.log(error)
            })
    }
    else {
        fetch("/CpdcApi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(queryBody)
        })
            .then(response => response.json())
            .then(data => {
                CreateChat(data);
                DataCompletenessRate(data, queryBody.model);
            })
            .catch(error => {
                console.log(error)
            })
    }
};
function DataCompletenessRate(data, model) {
    const checkboxes = document.querySelectorAll('input[name="CheckBoxItem"]:checked');
    const checkboxId = Array.from(checkboxes).map(checkbox => checkbox.id);
    let startTime = new Date($("#StartTime").val());
    let endTime = new Date($("#EndTime").val());
    let completenessRate = $("#CompletenessRate");
    let notNullCount = 0;
    checkboxId.map(i => {
        let filter = data.filter(item => item[i] != null).length;
        notNullCount += filter;
    })
    if (model == "T15") {
        let minute = Math.floor((endTime.getTime() - startTime.getTime()) / 60000 / 15) + 1;
        completenessRate.val(`${((notNullCount / (minute * checkboxId.length)) * 100).toFixed()}%`);
    }
    if (model == "T60") {
        let hours = Math.floor((endTime.getTime() - startTime.getTime()) / 3600000) + 1;
        completenessRate.val(`${((notNullCount / (hours * checkboxId.length)) * 100).toFixed()}%`);
    }
    if (model == "T1440") {
        let day = Math.floor((endTime.getTime() - startTime.getTime()) / 3600000 / 24) + 1;
        completenessRate.val(`${((notNullCount / (day * checkboxId.length)) * 100).toFixed()}%`);
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
