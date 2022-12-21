import Head from 'next/head'
import Image from 'next/image'
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from 'react';
import styles from '../styles/Home.module.css'

type dataStore = {
  help: string,
  result: {
    fields: { type: string, id: string }[],
    limit: number,
    records: {
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
    }[],
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

  return {
    props: { records: records, fields: fields, years: years, universities: universities, schools: schools, degrees: degrees }
  };
}

const Test = ({ records, fields, years, universities, schools, degrees }: { records: dataStore, fields: string[], years: string[], universities: string[], schools: string[], degrees: string[] }) => {
  console.log(fields);
  console.log(years);
  console.log(universities);
  console.log(schools);
  console.log(degrees);
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
          <h1 className="text-3xl font-bold underline">
          </h1>
        </div>
      </main>
    </>
  )
}

export default Test;