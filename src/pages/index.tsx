import Head from 'next/head';
import { Bar, Scatter } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect, useRef, MutableRefObject } from 'react';
import {
  Navbar,
  MobileNav,
  Typography,
  Tooltip,
  Switch,
  Button,
  IconButton,
  Select,
  Option,
} from '@material-tailwind/react';
import type { dataStore, dataRecord } from '@/types';
import { axisOptions, colors } from '@/constants';
import { timeout } from '@/utils';
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartTooltip,
  Legend
);

const primaryButtonColor: string =
  'from-primary to-primary shadow-primary/40 hover:shadow-lg hover:shadow-primary/40';
const secondaryButtonColor: string =
  'from-white to-white hover:from-gray-200 hover:to-gray-200 shadow-gray-400/10 hover:shadow-lg hover:shadow-gray-400/40 text-primary';

export const getStaticProps = async () => {
  // Variables for filter
  var years: string[] = [];
  var universities: string[] = [];
  var schools: string[] = [];
  var degrees: string[] = [];

  // Variables for fields
  var fields: string[] = [];

  // Fetch latest data
  var latestData: dataStore = await (
    await fetch(
      'https://data.gov.sg/api/action/datastore_search?resource_id=3a60220a-80ae-4a63-afde-413f05328914&limit=1&sort=year desc'
    )
  ).json();

  // Fetch all data based on previous query
  const totalRecords: number = latestData.result.total;
  var allData: dataStore = await (
    await fetch(
      'https://data.gov.sg/api/action/datastore_search?resource_id=3a60220a-80ae-4a63-afde-413f05328914&limit=' +
        totalRecords
    )
  ).json();
  var records: dataRecord[] = allData.result.records;

  // Get unique data for filtering
  records.map((record) => {
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
  });

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
  fields.push(allData.result.fields[5].id);
  fields.push(allData.result.fields[6].id);
  fields.push(allData.result.fields[7].id);
  fields.push(allData.result.fields[8].id);
  fields.push(allData.result.fields[9].id);
  fields.push(allData.result.fields[10].id);
  fields.push(allData.result.fields[11].id);
  fields.push(allData.result.fields[12].id);

  return {
    props: {
      records: records,
      fields: fields,
      years: years,
      universities: universities,
      schools: schools,
      degrees: degrees,
    },
  };
};

const Index = ({
  records,
  fields,
  years,
  universities,
  schools,
  degrees,
}: {
  records: dataRecord[];
  fields: string[];
  years: string[];
  universities: string[];
  schools: string[];
  degrees: string[];
}) => {
  // Hooks & Functions
  const [openNav, setOpenNav] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [verticalAxis, setVerticalAxis] = useState(2);
  const [horizontalAxis, setHorizontalAxis] = useState(0);
  const [copiedRecent, setCopiedRecent] = useState(false);
  const [selectedYears, updateSelectedYears] = useState<string[]>(years);
  const [selectedUniversities, updateSelectedUniversities] =
    useState<string[]>(universities);
  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  /*
      fields index values: 
      #0:  employment_rate_overall
      #1:  employment_rate_ft_perm
      #2:  basic_monthly_mean
      #3:  basic_monthly_median
      #4:  gross_monthly_mean
      #5:  gross_monthly_median
      #6:  gross_mthly_25_percentile
      #7:  gross_mthly_75_percentile
  */
  const chartData = {
    datasets: universities.map((university) => {
      return {
        label: university,
        data: records
          .filter((record) => {
            if (record.university == university) {
              if (selectedYears.includes(record.year)) {
                if (selectedUniversities.includes(record.university)) {
                  if (
                    record.year
                      .toLowerCase()
                      .includes(searchInput.toLowerCase()) ||
                    record.university
                      .toLowerCase()
                      .includes(searchInput.toLowerCase()) ||
                    record.school
                      .toLowerCase()
                      .includes(searchInput.toLowerCase()) ||
                    record.degree
                      .toLowerCase()
                      .includes(searchInput.toLowerCase())
                  ) {
                    return true;
                  }
                }
              }
            }
          })
          .map((record) => {
            return {
              // Plotted Points in ChartJS
              x: record[fields[horizontalAxis] as keyof dataRecord],
              y: record[fields[verticalAxis] as keyof dataRecord],
              // Hidden values in ChartJS
              record: record,
            };
          }),
        backgroundColor: colors[0][universities.indexOf(university)],
      };
    }),
  };
  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          beforeTitle: (tooltipItem: any) => {
            const recordUniversity =
              tooltipItem[0].dataset.data[tooltipItem[0].dataIndex].record
                .university;
            const recordYear =
              tooltipItem[0].dataset.data[tooltipItem[0].dataIndex].record.year;
            return recordUniversity + ', ' + recordYear;
          },
          title: (tooltipItem: any) => {
            const recordSchool =
              tooltipItem[0].dataset.data[tooltipItem[0].dataIndex].record
                .school;
            return recordSchool;
          },
          afterTitle: (tooltipItem: any) => {
            const recordDegree =
              tooltipItem[0].dataset.data[tooltipItem[0].dataIndex].record
                .degree;
            return recordDegree;
          },
          label: (tooltipItem: any) => {
            const recordUniversity =
              tooltipItem.dataset.data[tooltipItem.dataIndex].record
                .university.replace(/[a-z]/g, '').replace(/ /g, '');
            const recordDegree =
              tooltipItem.dataset.data[tooltipItem.dataIndex].record
                .degree;
            return recordUniversity + ', ' + recordDegree + ': ' + tooltipItem.formattedValue;
          }
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? '#747474' : '#E1E1E1',
        },
      },
      y: {
        grid: {
          color: darkMode ? '#747474' : '#E1E1E1',
        },
      },
    },
  };
  Chart.defaults.color = darkMode ? '#FFFFFF' : '#1F2937';

  // Miscellaneous Variables
  const chartRef: MutableRefObject<null> = useRef(null);
  const navigationItems: { name: string; href: string; target?: string }[] = [
    { name: 'Pages', href: '#' },
    { name: 'Account', href: '#' },
    { name: 'Blocks', href: '#' },
    {
      name: 'Source',
      href: 'https://data.gov.sg/dataset/graduate-employment-survey-ntu-nus-sit-smu-suss-sutd',
      target: '_blank',
    },
  ];

  // Miscellaneous Functions
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const copyClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedRecent(true);
    timeout(2000).then(() => {
      setCopiedRecent(false);
    });
  };
  const downloadChart = (chartRef: any) => {
    const base64Image = chartRef.current.toBase64Image();

    fetch(base64Image, {
      method: 'GET',
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const fileType = '.png';
          const timestamp = Date.now();
          const fileName =
            'DSSG ' +
            new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).format(timestamp) +
            fileType;

          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Filter Chart Functions
  const updateSearch = (input: string) => {
    setSearchInput(input);
  };
  const updateYearFilter = (index: number) => {
    if (selectedYears.includes(years[index])) {
      var tempArr = [...selectedYears];
      const removeIndex = tempArr.indexOf(years[index]);
      tempArr.splice(removeIndex, 1);
      updateSelectedYears(tempArr);
    } else {
      var tempArr = [...selectedYears];
      tempArr.push(years[index]);
      updateSelectedYears(tempArr);
    }
  };
  const updateUniversityFilter = (index: number) => {
    if (selectedUniversities.includes(universities[index])) {
      var tempArr = [...selectedUniversities];
      const removeIndex = tempArr.indexOf(universities[index]);
      tempArr.splice(removeIndex, 1);
      updateSelectedUniversities(tempArr);
    } else {
      var tempArr = [...selectedUniversities];
      tempArr.push(universities[index]);
      updateSelectedUniversities(tempArr);
    }
  };
  const updateVerticalAxis = (index: any) => {
    setVerticalAxis(parseInt(index));
  };
  const updateHorizontalAxis = (index: any) => {
    setHorizontalAxis(parseInt(index));
  };

  return (
    <>
      <Head>
        <title>Degree Salary SG</title>
        <meta
          name="description"
          content="Graduate Employment Survey w/ data.gov.sg API"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`transition ${darkMode ? `bg-[#0a1c2b]` : `bg-gray-100`}`}
      >
        {/* Navigation Bar */}
        <Navbar
          className={`mx-0 max-w-none w-screen py-2 px-4 lg:px-8 lg:py-4 rounded-t-none ${
            darkMode
              ? `bg-[#0f2a40] border-slate-900 bg-opacity-100`
              : `bg-white`
          }`}
        >
          {/* Navigation Bar (Desktop) */}
          <div className="mx-auto flex items-center justify-between text-blue-gray-900">
            {/* Degree Salary SG Logo */}
            <Typography
              as="a"
              href="#"
              variant="small"
              className={`mr-4 cursor-pointer py-1.5 font-normal text-primary ${
                darkMode ? `text-white` : `text-primary`
              }`}
            >
              <b>
                Degree Salary <span className="text-red-400">SG</span>
              </b>
            </Typography>
            {/* Navigation Items (Desktop) */}
            <div className="hidden lg:block">
              <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                {navigationItems.map((navigationItem) => {
                  return (
                    <Typography
                      as="li"
                      variant="small"
                      key={navigationItem.name}
                      className="p-1 font-normal"
                    >
                      <a
                        href={navigationItem.href}
                        target={navigationItem.target}
                        className={`flex items-center ${
                          darkMode
                            ? `text-white hover:text-white/80`
                            : `text-primary hover:text-primary/40`
                        }`}
                      >
                        {navigationItem.name}
                      </a>
                    </Typography>
                  );
                })}
              </ul>
            </div>
            {/* Toggle Dark Mode (Desktop) */}
            <div className="hidden lg:block">
              <div
                className={`mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-3 cursor-pointer`}
                onClick={() => {
                  toggleDarkMode();
                }}
              >
                <span
                  className={`div ${
                    darkMode
                      ? `text-white hover:text-white/80`
                      : `text-primary hover:text-primary/40`
                  }`}
                >{`${darkMode ? `Dark` : `Light`} Mode`}</span>
                <Switch
                  color="blue-gray"
                  className={`${
                    darkMode ? secondaryButtonColor : primaryButtonColor
                  }`}
                  onClickCapture={() => {
                    toggleDarkMode();
                  }}
                  onChange={() => {
                    toggleDarkMode();
                  }}
                  checked={darkMode}
                />
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
              {navigationItems.map((navigationItem) => {
                return (
                  <Typography
                    as="li"
                    variant="small"
                    key={navigationItem.name}
                    className="p-1 font-normal"
                  >
                    <a
                      href={navigationItem.href}
                      target={navigationItem.target}
                      className={`flex items-center ${
                        darkMode
                          ? `text-white hover:text-white/80`
                          : `text-primary hover:text-primary/40`
                      }`}
                    >
                      {navigationItem.name}
                    </a>
                  </Typography>
                );
              })}
            </ul>
            {/* Dark Mode Button (Mobile/Tablet) */}
            <Tooltip content={`Change to ${darkMode ? `Light` : `Dark`} Mode`}>
              <Button
                variant="gradient"
                size="sm"
                className={`mb-2 w-full ${
                  darkMode ? secondaryButtonColor : primaryButtonColor
                }`}
                onClick={() => {
                  toggleDarkMode();
                }}
              >
                <span>{`${darkMode ? `Light` : `Dark`} Mode`}</span>
              </Button>
            </Tooltip>
          </MobileNav>
        </Navbar>

        {/* Main Body */}
        <div
          className={`text-center place-items-center py-8 ${
            darkMode ? `text-white` : `text-gray-800`
          }`}
        >
          {/* Title Group */}
          {/* <h1 className='text-5xl font-bold mt-0 mb-6'>Heading</h1>
          <h3 className='text-3xl font-bold mb-8'>Subeading</h3> */}

          {/* ChartJS Filters */}
          <div className="text-left translate-x-[10%] w-4/5 mb-8">
            {/* Search */}
            <div className="mb-5">
              <div className="w-full gap-2">
                <form>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      className="block w-full p-3 pl-10 text-sm text-gray-900 border font-medium  border-gray-400 focus:outline-none focus:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Search Schools, Degrees..."
                      onChange={(event) => {
                        updateSearch(event.target.value);
                      }}
                    />
                  </div>
                </form>
              </div>
            </div>
            {/* Year */}
            <div className="mb-5">
              <h3 className="text-xl font-bold">Year of Survey</h3>
              <div className="overflow-x-auto w-full gap-2 whitespace-nowrap">
                {years.map((year, index) => {
                  return (
                    <Button
                      size="sm"
                      key={year}
                      variant="gradient"
                      className={`w-24 mx-2 my-3 ${
                        selectedYears.includes(year)
                          ? darkMode
                            ? secondaryButtonColor
                            : primaryButtonColor
                          : darkMode
                          ? primaryButtonColor
                          : secondaryButtonColor
                      }`}
                      onClick={() => updateYearFilter(index)}
                    >
                      <span>{year}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            {/* University */}
            <div className="mb-5">
              <h3 className="text-xl font-bold">University</h3>
              <div className="overflow-x-auto w-full gap-2 whitespace-nowrap">
                {universities.map((university, index) => {
                  return (
                    <Button
                      size="sm"
                      key={university}
                      variant="gradient"
                      className={`w-24 mx-2 my-3 ${
                        selectedUniversities.includes(university)
                          ? darkMode
                            ? secondaryButtonColor
                            : primaryButtonColor
                          : darkMode
                          ? primaryButtonColor
                          : secondaryButtonColor
                      }`}
                      onClick={() => updateUniversityFilter(index)}
                    >
                      <span>
                        {university.replace(/[a-z]/g, '').replace(/ /g, '')}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ChartJS Axis */}
          <div
            className={`w-screen flex justify-center ${
              darkMode ? `text-white` : `text-gray-800`
            }`}
          >
            <div className="flex items-center gap-4 mb-5">
              {/* Horizontal Axis */}
              <Select
                value="0"
                label="Chart x-axis"
                onChange={updateHorizontalAxis}
                className=" text-gray-900 font-medium block w-64 p-3 pl-10 text-sm rounded-lg bg-gray-50"
              >
                {fields.map((field, index) => {
                  return (
                    <Option
                      key={field}
                      value={index.toString()}
                      className="text-gray-700"
                    >
                      {axisOptions[index]}
                    </Option>
                  );
                })}
              </Select>
              <h3 className="text-xl font-bold">/</h3>
              {/* Vertical Axis */}
              <Select
                value="2"
                label="Chart y-axis"
                onChange={updateVerticalAxis}
                className=" text-gray-900 font-medium block w-64 p-3 pl-10 text-sm rounded-lg bg-gray-50"
              >
                {fields.map((field, index) => {
                  return (
                    <Option
                      key={field}
                      value={index.toString()}
                      className="text-gray-700"
                    >
                      {axisOptions[index]}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>

          {/* ChartJS Display */}
          <div
            className={`w-screen flex justify-center items-center ${
              darkMode ? `text-white` : `text-gray-800`
            }`}
          >
            <div className="w-5/6 lg:w-4/5 xl:w-3/5 2xl:w-1/2">
              {/* <Bar data={chartData} ref={chartRef} options={chartOptions} /> */}
              <Scatter data={chartData} ref={chartRef} options={chartOptions} />
            </div>
          </div>

          {/* ChartJS Action Buttons */}
          <div className="mt-5">
            {/* Download Button */}
            <Tooltip content="Download Image File (.png)">
              <Button
                variant="gradient"
                size="sm"
                className={`w-28 mx-3 ${
                  darkMode ? secondaryButtonColor : primaryButtonColor
                }`}
                onClick={() => downloadChart(chartRef)}
              >
                <span>Download</span>
              </Button>
            </Tooltip>
            {/* Copy to Clipboard Button */}
            <Tooltip content="Copy link to Clipboard">
              <Button
                variant="gradient"
                size="sm"
                className={`w-28 mx-3 lg:inline-block ${
                  darkMode ? secondaryButtonColor : primaryButtonColor
                }`}
                onClick={() => {
                  copyClipboard();
                }}
              >
                <span>{copiedRecent ? `Copied` : `Share`}</span>
              </Button>
            </Tooltip>
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;
