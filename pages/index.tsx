import Head from 'next/head';
import { Scatter } from 'react-chartjs-2';
import { Chart, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

type dataRecord = {
  basic_monthly_mean: string,
  basic_monthly_median: string,
  degree: string,
  employment_rate_ft_perm: string,
  employment_rate_overall: string,
  gross_monthly_mean: string,
  gross_monthly_median: string,
  gross_mthly_25_percentile: string,
  gross_mthly_75_percentile: string,
  school: string,
  university: string,
  year: string,
  _id: number
};

type dataStore = {
  help: string,
  result: {
    fields: { type: string, id: string }[],
    limit: number,
    records: dataRecord[],
    resource_id: string,
    sort: string,
    total: number,
    _links: { next: string, start: string }
  }
  success: boolean,
  year: number[]
}

export const getStaticProps = async () => {
  // Variables for filter
  var years: string[] = [];
  var universities: string[] = [];
  var schools: string[] = [];
  var degrees: string[] = [];

  // Variables for fields
  var fields: string[] = [];

  // Fetch latest data
  var latestData: dataStore = await (await fetch('https://data.gov.sg/api/action/datastore_search?resource_id=3a60220a-80ae-4a63-afde-413f05328914&limit=1&sort=year desc')).json();

  // Fetch all data based on previous query
  const totalRecords: number = latestData.result.total;
  var allData: dataStore = await (await fetch('https://data.gov.sg/api/action/datastore_search?resource_id=3a60220a-80ae-4a63-afde-413f05328914&limit=' + totalRecords)).json();
  var records: dataStore["result"]["records"] = allData.result.records;

  // Get unique data for filtering
  records.map(record => {
    // Get unique years
    if (years.indexOf(record.year) === -1) {
      years.push(record.year);
    }

    // Get unique universities
    if (universities.indexOf(record.university) === -1) {
      universities.push(record.university);
    }

    // Get unique schools
    if (schools.indexOf(record.school) === -1) {
      schools.push(record.school);
    }

    // Get unique degrees
    if (degrees.indexOf(record.degree) === -1) {
      degrees.push(record.degree);
    }
  })

  // Get fields that can be measured in x-y axe
  /* 
      #0:   _id
      #1:   year
      #2:   university
      #3:   school
      #4:   degree
      #5:   employment_rate_overall
      #6:   employment_rate_ft_perm
      #7:   basic_monthly_mean
      #8:   basic_monthly_median
      #9:   gross_monthly_mean
      #10:  gross_monthly_median
      #11:  gross_mthly_25_percentile
      #12:  gross_mthly_75_percentile
  */
  fields.push(allData.result.fields[1].id);
  fields.push(allData.result.fields[5].id);
  fields.push(allData.result.fields[6].id);
  fields.push(allData.result.fields[7].id);
  fields.push(allData.result.fields[8].id);
  fields.push(allData.result.fields[9].id);
  fields.push(allData.result.fields[10].id);
  fields.push(allData.result.fields[11].id);
  fields.push(allData.result.fields[12].id);

  return {
    props: { records: records, fields: fields, years: years, universities: universities, schools: schools, degrees: degrees }
  };
}

const Test = ({ records, fields, years, universities, schools, degrees }: { records: dataRecord[], fields: string[], years: string[], universities: string[], schools: string[], degrees: string[] }) => {
  
  // console.log(fields);
  // console.log(years);
  // console.log(universities);
  // console.log(schools);
  // console.log(degrees);
  
  Chart.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

  const data = {
    datasets: [
      {
        label: 'Employment Rate Overall',
        data: records.map(record => { 
          return { x: record[fields[0] as keyof dataRecord], y: record.employment_rate_overall }
        }),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Employment Rate Full Time',
        data: records.map(record => { 
          return { x: record.year, y: record.employment_rate_ft_perm }
        }),
        backgroundColor: 'rgba(0, 99, 132, 1)',
      },
    ],
  };

  console.log(fields[0]);

  return (
    <>
      <Head>
        <title>Test API</title>
        <meta name="description" content="Testing data.gov.sg API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <Scatter data={data} />
        </div>
      </main>
    </>
  )
}

export default Test;