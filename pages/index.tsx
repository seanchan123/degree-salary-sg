import Head from 'next/head';
import { Bar, Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

import { useState, useEffect } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

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

const colors: string[][] = [
  // Color Scheme #0 (Default - Shade of Primary Color)
  ["rgba(25, 69, 105, 1)", "rgba(95, 132, 162, 1)", "rgba(145, 174, 196, 1)", "rgba(183, 208, 225, 1)", "rgba(202, 222, 237, 1)", "rgba(219, 236, 244, 1)"],
  // Color Scheme #1 (Distinct - Rainbow)
  ["rgba(230, 25, 27, 1)", "rgba(245, 130, 49, 1)", "rgba(255, 225, 25, 1)", "rgba(60, 180, 75, 1)", "rgba(66, 99, 216, 1)", "rgba(240, 50, 230, 1)"]
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
          backgroundColor: colors[0][universities.indexOf(university)]
        }
      })
  };

  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Pages
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Account
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Blocks
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Docs
        </a>
      </Typography>
    </ul>
  );

  return (
    <>
      <Head>
        <title>Test API</title>
        <meta name="description" content="Testing data.gov.sg API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        
        <header>
          <nav className="block rounded-xl shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border border-white/80 bg-white text-white mx-0 w-screen py-2 px-4 lg:px-8 lg:py-4">
            <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
              <Typography
                as="a"
                href="#"
                variant="small"
                className="mr-4 cursor-pointer py-1.5 font-normal"
              >
                <span>Material Tailwind</span>
              </Typography>
              <div className="hidden lg:block">{navList}</div>
              <Button variant="gradient" size="sm" className="hidden lg:inline-block">
                <span>Buy Now</span>
              </Button>
              <IconButton
                variant="text"
                className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                ripple={false}
                onClick={() => setOpenNav(!openNav)}
              >
                {openNav ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </IconButton>
            </div>
            <MobileNav open={openNav}>
              {navList}
              <Button variant="gradient" size="sm" fullWidth className="mb-2">
                <span>Buy Now</span>
              </Button>
            </MobileNav>
          </nav>
        </header>

        <div className="text-center bg-gray-50 text-gray-800 py-20 px-6">
          <h1 className="text-5xl font-bold mt-0 mb-6">Heading</h1>
          <h3 className="text-3xl font-bold mb-8">Subeading</h3>
          <a className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="light" href="#!" role="button">Get started</a>
        </div>

        <div>
          <Bar data={data} />
          {/* <Scatter data={data} /> */}
        </div>

      </main>
    </>
  )
}

export default Test;