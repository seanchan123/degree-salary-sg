import Head from 'next/head';
import { Bar, Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip as ChartTooltip, Legend } from 'chart.js';

import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Navbar, MobileNav, Typography, Tooltip, Switch, Button, IconButton } from "@material-tailwind/react";

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartTooltip, Legend);

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
const secondaryButtonColor: string = "from-white to-white hover:from-gray-200 hover:to-gray-200 shadow-gray-400/10 hover:shadow-lg hover:shadow-gray-400/40 text-primary";
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

  // Hooks & Functions
  const [openNav, setOpenNav] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedRecent, setCopiedRecent] = useState(false);
  const [selectedYears, updateSelectedYears] = useState<string[]>(years);
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);


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
  const chartData = {
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
  const chartOptions = {
    scales: {
      x: {
        grid: {
          color: darkMode ? "#747474" : "#E1E1E1"
        }
      },
      y: {
        grid: {
          color: darkMode ? "#747474" : "#E1E1E1"
        }
      }
    }
  }
  Chart.defaults.color = darkMode ? "#FFFFFF" : "#1F2937";

  // Miscellaneous Variables
  const chartRef: MutableRefObject<null> = useRef(null);
  const navigationItems: { name: string, href: string, target?: string }[] = [
    { name: "Pages", href: "#" },
    { name: "Account", href: "#" },
    { name: "Blocks", href: "#" },
    { name: "Source", href: "https://data.gov.sg/dataset/graduate-employment-survey-ntu-nus-sit-smu-suss-sutd", target: "_blank" },
  ]

  // Miscellaneous Functions
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
  
  // Filter Chart Functions
  const updateYearFilter = ((index: number) => {
    if (selectedYears.includes(years[index])){
      var tempArr = [...selectedYears];
      const removeIndex = tempArr.indexOf(years[index]);
      tempArr.splice(removeIndex, 1);
      updateSelectedYears(tempArr);
    } else {
      var tempArr = [...selectedYears];
      tempArr.push(years[index])
      updateSelectedYears(tempArr);
    }
  })


  return (
    <>
      <Head>
        <title>Test API</title>
        <meta name="description" content="Testing data.gov.sg API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`h-screen transition ${darkMode ? `bg-[#0a1c2b]` : `bg-gray-100`}`}>
        {/* Navigation Bar */}
        <Navbar className={`mx-0 max-w-none w-screen py-2 px-4 lg:px-8 lg:py-4 rounded-t-none ${darkMode ? `bg-[#0f2a40] border-slate-900 bg-opacity-100` : `bg-white`}`}>
          {/* Navigation Bar (Desktop) */}
          <div className="mx-auto flex items-center justify-between text-blue-gray-900">
            {/* Degree Salary SG Logo */}
            <Typography
              as="a"
              href="#"
              variant="small"
              className={`mr-4 cursor-pointer py-1.5 font-normal text-primary ${darkMode ? `text-white` : `text-primary`}`}
            >
              <b>Degree Salary <span className="text-red-400">SG</span></b>
            </Typography>
            {/* Navigation Items (Desktop) */}
            <div className="hidden lg:block">
              <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                {navigationItems.map(navigationItem => {
                  return (
                    <Typography
                      as="li"
                      variant="small"
                      className="p-1 font-normal"
                    >
                      <a href={navigationItem.href} target={navigationItem.target} className={`flex items-center ${darkMode ? `text-white hover:text-white/80` : `text-primary hover:text-primary/40`}`}>
                        {navigationItem.name}
                      </a>
                    </Typography>
                  )
                })}
              </ul>
            </div>
            {/* Toggle Dark Mode (Desktop) */}
            <div className="hidden lg:block">
              <div className={`mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-3 cursor-pointer`} onClick={() => { toggleDarkMode() }}>
                <span className={`div ${darkMode ? `text-white hover:text-white/80` : `text-primary hover:text-primary/40`}`}>{`${darkMode ? `Dark` : `Light`} Mode`}</span>
                <Switch color='blue-gray' className={`${darkMode ? secondaryButtonColor : primaryButtonColor}`} onClickCapture={() => { toggleDarkMode() }} onChange={() => { toggleDarkMode() }} checked={darkMode} />
              </div>
            </div>
            {/* Hamburger Button (Mobile/Tablet) */}
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
          {/* Navigation Bar (Mobile/Tablet) */}
          <MobileNav className="mx-0 w-full" open={openNav}>
            {/* Navigation Items (Mobile/Tablet) */}
            <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navigationItems.map(navigationItem => {
                return (
                  <Typography
                    as="li"
                    variant="small"
                    className="p-1 font-normal"
                  >
                    <a href={navigationItem.href} target={navigationItem.target} className={`flex items-center ${darkMode ? `text-white hover:text-white/80` : `text-primary hover:text-primary/40`}`}>
                      {navigationItem.name}
                    </a>
                  </Typography>
                )
              })}
            </ul>
            {/* Dark Mode Button (Mobile/Tablet) */}
            <Tooltip content={`Change to ${darkMode ? `Light` : `Dark`} Mode`}>
              <Button variant="gradient" size="sm" className={`mb-2 w-full ${darkMode ? secondaryButtonColor : primaryButtonColor}`} onClick={() => { toggleDarkMode() }}>
                <span>{`${darkMode ? `Light` : `Dark`} Mode`}</span>
              </Button>
            </Tooltip>
          </MobileNav>
        </Navbar>

        {/* Main Body */}
        <div className={`text-center place-items-center py-10 ${darkMode ? `text-white` : `text-gray-800`}`}>
          {/* Title Group */}
          {/* <h1 className="text-5xl font-bold mt-0 mb-6">Heading</h1>
          <h3 className="text-3xl font-bold mb-8">Subeading</h3> */}

          {/* ChartJS Filters */}
          <div className='text-left translate-x-[10%] w-4/5'>
            <h3 className="text-xl font-bold">Year of Survey</h3>
            <div className="overflow-x-auto w-full gap-2 ">
              {
                years.map((year, index) => {
                  return (
                    <Button variant="gradient" size="sm" 
                      className={`w-28 mx-2 my-3 ${selectedYears.includes(year) ? 
                        (darkMode ? secondaryButtonColor : primaryButtonColor) : 
                        (darkMode ? primaryButtonColor : secondaryButtonColor)}`} 
                      onClick={() => updateYearFilter(index)}>
                      <span>{year}</span>
                    </Button>
                  )
                })
              }
            </div>
          </div>

          {/* ChartJS Display */}
          <div className={`w-screen flex justify-center items-center ${darkMode ? `text-white` : `text-gray-800`}`}>
            <div className="w-5/6 lg:w-4/5 xl:w-3/5 2xl:w-1/2">
              <Bar data={chartData} ref={chartRef} options={chartOptions} />
              {/* <Scatter data={chartData} /> */}
            </div>
          </div>

          {/* ChartJS Action Buttons */}
          <div className='mt-10'>
            <Tooltip content="Download Image File (.png)">
              <Button variant="gradient" size="sm" className={`w-28 mx-3 ${darkMode ? secondaryButtonColor : primaryButtonColor}`} onClick={() => downloadChart(chartRef)} >
                <span>Download</span>
              </Button>
            </Tooltip>
            <Tooltip content="Copy link to Clipboard">
              <Button variant="gradient" size="sm" className={`w-28 mx-3 lg:inline-block ${darkMode ? secondaryButtonColor : primaryButtonColor}`} onClick={() => { copyClipboard() }}>
                <span>{copiedRecent ? `Copied` : `Share`}</span>
              </Button>
            </Tooltip>
          </div>

        </div>
      </main>
    </>
  )
}

export default Index;