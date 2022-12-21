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
  // Fetch 0 latest record
  var result = await fetch('https://data.gov.sg/api/action/datastore_search?resource_id=3a60220a-80ae-4a63-afde-413f05328914&limit=0&sort=year desc');
  var data = await result.json();

  return {
    props: { dataSet: data }
  };
}

const Test = ({ dataSet }: { dataSet: dataStore }) => {
  console.log(dataSet);
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