## ![image](https://github.com/seanchan123/degree-salary-sg/assets/60666738/de4bd093-3c5c-4b94-9b8e-b7a056950417)

**[Degree Salary SG](https://degree-salary-sg-ochre.vercel.app/)** visualizes Singapore's Graduate Employment Survey (GES) for all universities from 2013 onwards!

This project was created as there was no effective visualization tool that could compare between the degree programmes of each university. Alternatives found when Googling often depicts the data represented in a table format, or in other forms, which limits the effectiveness when comparing between the degree programmes. Conversely, those that are able to compare, often lacks all the autonomous universities in Singapore - therefore resulting in a restricted point of view for the users.

***Preview***
![image](https://github.com/seanchan123/degree-salary-sg/assets/60666738/6ecb61c6-3108-4046-8137-f224263d4cb7)

A preview of the website can be found [here](https://degree-salary-sg-ochre.vercel.app/). This release is not from the latest commit.

Users are able to **filter** and **search** between the year, the university and the degree programme against any 2 chosen axis:

- Employment Rate (Overall)
- Employment Rate (Full Time/Permanent)
- Basic Monthly (Mean)
- Basic Monthly (Median)
- Gross Monthly (Mean)
- Gross Monthly (Median)
- Gross Monthly (25th Percentile)
- Gross Monthly (75th Percentile)

Last but not least, users are able to download and share their curated chart!

## Dataset

![image](https://d33wubrfki0l68.cloudfront.net/7b7e8b84b8180770131a2838266cc18409b22293/545c3/images/logo_govtech_hort.gif)

Our dataset are retrieved from the API provided by Government Technology Agency's (Govtech Singapore) [Data.gov.sg](https://www.tech.gov.sg/products-and-services/data-gov-sg/).

This effort is not a collaborative effort with Govtech Singapore, the API is public and is free to be used by the public.

Therefore, any misleading information found in the dataset falls under Govtech Singapore's responsibility.

## **Update as of 28/01/2024

This project was abandoned due to several reasons, as the dataset comes directly from [data.gov.sg](https://beta.data.gov.sg/datasets/d_3c55210de27fcccda2ed0c63fdd2b352/view):

- Dataset has to be [requested](https://github.com/datagovsg/datagovsg-datasets/issues/1481) every few months
  - Different universities has different GES release date
  - Resulting in multiple issues raised per year
- Project's viability is 100% dependent on the outcome of the request
- Upon successful request, the dataset takes 2-3 months to come through

From the aforementioned reasons, the website will therefore be out of date often.

And therefore, would not be ideal to be a go-to website to visualize the GES data.
