import Head from 'next/head';
import { Bar, Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

import { useState, useEffect, useRef } from "react";
import { Navbar, MobileNav, Typography, Tooltip as ButtonTooltip, Switch, Button, IconButton } from "@material-tailwind/react";

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

// Miscellaneous variables/functions
const colors: string[][] = [
  // Color Scheme #0 (Default - Shade of Primary Color)
  ["rgba(25, 69, 105, 1)", "rgba(95, 132, 162, 1)", "rgba(145, 174, 196, 1)", "rgba(183, 208, 225, 1)", "rgba(202, 222, 237, 1)", "rgba(219, 236, 244, 1)"],
  // Color Scheme #1 (Distinct - Rainbow)
  ["rgba(230, 25, 27, 1)", "rgba(245, 130, 49, 1)", "rgba(255, 225, 25, 1)", "rgba(60, 180, 75, 1)", "rgba(66, 99, 216, 1)", "rgba(240, 50, 230, 1)"]
]
const primaryButtonColor: string = "from-primary to-primary shadow-primary/40 hover:shadow-lg hover:shadow-primary/40";
const secondaryButtonColor: string = "from-white to-white hover:from-gray-100 hover:to-gray-100 shadow-gray-200/10 hover:shadow-lg hover:shadow-gray-200/40 text-primary";
const timeout = ((delay: number) => {
  return new Promise(res => setTimeout(res, delay));
})

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
  fields.push(allData.result.fields[2].id);
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

const Index = ({ records, fields, years, universities, schools, degrees }: { records: dataRecord[], fields: string[], years: string[], universities: string[], schools: string[], degrees: string[] }) => {

  /*
      fields index values: 
      #0:   year
      #1:   university
      #3:   employment_rate_overall
      #4:   employment_rate_ft_perm
      #5:   basic_monthly_mean
      #6:   basic_monthly_median
      #7:   gross_monthly_mean
      #8:  gross_monthly_median
      #8:  gross_mthly_25_percentile
      #9:  gross_mthly_75_percentile
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
            return { x: record[fields[1] as keyof dataRecord], y: record[fields[5] as keyof dataRecord] }
          }),
          backgroundColor: colors[0][universities.indexOf(university)]
        }
      })
  };

  // Hooks & Functions
  const [openNav, setOpenNav] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedRecent, setCopiedRecent] = useState(false);
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  // Miscellaneous variables
  const chartRef = useRef(null);
  const navigationItems: { name: string, href: string }[] = [
    { name: "Pages", href: "#" },
    { name: "Account", href: "#" },
    { name: "Blocks", href: "#" },
    { name: "Source", href: "https://data.gov.sg/dataset/graduate-employment-survey-ntu-nus-sit-smu-suss-sutd" },
  ]

  // Miscellaneous functions
  const toggleDarkMode = (() => {
    setDarkMode(!darkMode);
  })
  const copyClipboard = (() => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedRecent(true);
    timeout(2000).then(() => { setCopiedRecent(false) });
  })
  const downloadChart = ((chartRef: any) => {
    const base64Image = chartRef.current.toBase64Image();

    fetch(base64Image, {
      method: "GET",
      headers: {}
    })
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png"); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  })

  return (
    <>
      <Head>
        <title>Test API</title>
        <meta name="description" content="Testing data.gov.sg API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`h-screen ${darkMode ? `bg-gray-300` : `bg-gray-100`}`}>
        <header>
          <Navbar className={`mx-0 max-w-none w-screen py-2 px-4 lg:px-8 lg:py-4 rounded-t-none ${darkMode ? `bg-primary/90` : `bg-white`}`}>
            <div className="mx-auto flex items-center justify-between text-blue-gray-900">
              <Typography
                as="a"
                href="#"
                variant="small"
                className={`mr-4 cursor-pointer py-1.5 font-normal text-primary ${darkMode ? `text-white` : `text-primary`}`}
              >
                <b>Degree Salary <span className="text-red-400">SG</span></b>
              </Typography>
              <div className="hidden lg:block">
                <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                  {navigationItems.map(navigationItem => {
                    return (
                      <Typography
                        as="li"
                        variant="small"
                        className="p-1 font-normal"
                      >
                        <a href={navigationItem.href} className={`flex items-center ${darkMode ? `text-white hover:text-white/80` : `text-primary hover:text-primary/40`}`}>
                          {navigationItem.name}
                        </a>
                      </Typography>
                    )
                  })}
                </ul>
              </div>
              <div className="hidden lg:block">
                <div className={`mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-3 cursor-pointer`} onClick={() => { toggleDarkMode() }}>
                  <span className={`div ${darkMode ? `text-white hover:text-white/80` : `text-primary hover:text-primary/40`}`}>{`${darkMode ? `Dark` : `Light`} Mode`}</span>
                  <Switch color='blue-gray' className={`${darkMode ? secondaryButtonColor : primaryButtonColor}`} onClickCapture={() => { toggleDarkMode() }} onChange={() => { toggleDarkMode() }} checked={darkMode} />
                </div>
              </div>
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
                    color={darkMode ? `white` : ``}
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
                    color={darkMode ? `white` : ``}
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
            <MobileNav className="mx-0 w-full" open={openNav}>
              <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                {navigationItems.map(navigationItem => {
                  return (
                    <Typography
                      as="li"
                      variant="small"
                      className="p-1 font-normal"
                    >
                      <a href={navigationItem.href} className={`flex items-center ${darkMode ? `text-white hover:text-white/80` : `text-primary hover:text-primary/40`}`}>
                        {navigationItem.name}
                      </a>
                    </Typography>
                  )
                })}
              </ul>
              <ButtonTooltip content="Copy to Clipboard">
                <Button variant="gradient" size="sm" className={`mb-2 w-full ${darkMode ? secondaryButtonColor : primaryButtonColor}`} onClick={() => { toggleDarkMode() }}>
                  <span>{`${darkMode ? `Light` : `Dark`} Mode`}</span>
                </Button>
              </ButtonTooltip>
            </MobileNav>
          </Navbar>
        </header>

        <div className="text-center text-gray-800 py-10 px-6">
          <h1 className="text-5xl font-bold mt-0 mb-6">Heading</h1>
          <h3 className="text-3xl font-bold mb-8">Subeading</h3>
          <h3 className="text-3xl font-bold mb-8">Data</h3>
          <div className="w-screen flex justify-center items-center">
            <div className="w-1/2">
              <Bar data={data} ref={chartRef} />
              {/* <Scatter data={data} /> */}
            </div>
          </div>
          <div className='mt-10'>
            <ButtonTooltip content="Download Image File (.png)">
              <Button variant="gradient" size="sm" className={`w-28 mx-3 ${darkMode ? secondaryButtonColor : primaryButtonColor}`} onClick={() => downloadChart(chartRef)} >
                <span>Download</span>
              </Button>
            </ButtonTooltip>
            <ButtonTooltip content="Copy link to Clipboard">
              <Button variant="gradient" size="sm" className={`w-28 mx-3 lg:inline-block ${darkMode ? secondaryButtonColor : primaryButtonColor}`} onClick={() => { copyClipboard() }}>
                <span>{copiedRecent ? `Copied` : `Share`}</span>
              </Button>
            </ButtonTooltip>
          </div>

        </div>
      </main>
    </>
  )
}

export default Index;