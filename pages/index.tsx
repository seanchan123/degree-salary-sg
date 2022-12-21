import Head from 'next/head';
import { Bar, Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

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

const colors: string[] = [
  "rgba(230, 25, 27, 1)",
  "rgba(245, 130, 49, 1)",
  "rgba(255, 225, 25, 1)",
  "rgba(60, 180, 75, 1)",
  "rgba(66, 99, 216, 1)",
  "rgba(240, 50, 230, 1)"
]

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

  /*
      fields index values: 
      #0:   year
      #1:   employment_rate_overall
      #2:   employment_rate_ft_perm
      #3:   basic_monthly_mean
      #4:   basic_monthly_median
      #5:   gross_monthly_mean
      #6:  gross_monthly_median
      #7:  gross_mthly_25_percentile
      #8:  gross_mthly_75_percentile
  */

  const data = {
    datasets:
      universities.map(university => {
        return {
          label: university,
          data: records.filter(record => {
            if (record.university == university) {
              return true;
            }
          }).map(record => {
            return { x: record[fields[0] as keyof dataRecord], y: record[fields[5] as keyof dataRecord] }
          }),
          backgroundColor: colors[universities.indexOf(university)]
        }
      })
  };

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
          <Bar data={data} />
          {/* <Scatter data={data} /> */}
        </div>
      </main>
    </>
  )
}

export default Test;