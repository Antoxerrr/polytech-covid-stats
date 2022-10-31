const HEADERS = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
}

async function setData(cls, recovered, deaths, total, date) {
    await counter(recovered, `.${cls} .recovered-data`);
    await counter(total, `.${cls} .total-data`);
    await counter(deaths, `.${cls} .deaths-data`);
    $(`.${cls} .date-data`).text(`(${date})`);
}

async function loadTotalStats(cls, iso) {
    let url = 'https://covid-api.com/api/reports/total';
    if (iso) {
        url += `?iso=${iso}`;
    }
    await axios.get(url, null, {headers: HEADERS}).then(response => {
        console.log(response)
        let totalData = response.data.data;
        let recovered = totalData.active;
        let deaths = totalData.deaths;
        let total = totalData.confirmed;
        let date = totalData.date;
        setData(cls, recovered, deaths, total, date);
    });
}

function createOption(select, value, html) {
    let opt = document.createElement('option');
    opt.value = value;
    opt.innerHTML = html;
    select.appendChild(opt);
}

async function loadRegions()  {
    await axios.get('https://covid-api.com/api/regions?order=name', null, {headers: HEADERS}).then(response => {
        let regions = response.data.data;
        let select = document.getElementById('select-country');

        createOption(select, '', '')
        regions.forEach(region => {
            createOption(select, region.iso, region.name);
        });
    });
}

async function counter(value, cls) {
    $(cls).spincrement({
        from: 0,
        to: value
    });
}

$('#select-country').change(async function () {
    if (this.value) {
        await loadTotalStats('region-row', this.value).then(() => {
            $('.region-row').fadeIn('fast');
        });
    } else {
        $('.region-row').fadeOut('fast');
    }
});

$(document).ready(() => {
    loadTotalStats('summary-row');
    loadRegions();
});
