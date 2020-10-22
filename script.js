const ctx = document.querySelector('#myChart').getContext('2d');
const startDate = document.querySelector('[data-date=from]');
const endDate = document.querySelector('[data-date=to]');
const select = document.querySelector('select');
const submit = document.querySelector('.submit');

function setCurrentDate() {
    let date = new Date();
    let newValue = date.getFullYear() + '-' + '0' + date.getMonth() + '-' + date.getDate();
    endDate.value = newValue;
}

function setWeek() {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    let newValue = date.getFullYear() + '-' + '0' + date.getMonth() + '-' + date.getDate();
    startDate.value = newValue;
}

async function getData(id) {
    let dates = [];
    let rates = [];
    let color;
    const currency = {
        '145': 'USD',
        '292': 'EUR',
        '298': 'RUR'
    }

    switch (id) {
        case '145':
            color = 'blue';
            break;
        case '292':
            color = 'red';
            break;
        case '298':
            color = 'green';
            break;
    }

    let config = {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: dates,
            datasets: [{
                label: currency[id],
                backgroundColor: 'transparent',
                borderColor: color,
                data: rates,
            }]
        },
        // Configuration options go here
        options: {
            responsive: true,
        }
    }

    let response = await fetch(`https://www.nbrb.by/API/ExRates/Rates/Dynamics/${id}?startDate=${startDate.value}&endDate=${endDate.value}`);
    if (response.ok) {
        let data = await response.json();
        data.forEach(item => {
            dates.push(item.Date.slice(0, 10))
            rates.push(item.Cur_OfficialRate);
        });
        window.chart = new Chart(ctx, config);
    }
}

submit.addEventListener('click', (e) => {
    e.preventDefault();
    let id = select.value;
    getData(id);
})

document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    setWeek();
})