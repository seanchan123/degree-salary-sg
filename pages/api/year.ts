// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    year: Number[]
}

function latestYears() {
    const oldestYear: number = 2013;
    const latestYear: number = new Date().getFullYear();
    var yearsArr: Number[] = [];

    for (let currentYear = oldestYear; currentYear < latestYear; currentYear++) {
        yearsArr.push(currentYear);
    }

    return yearsArr;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.status(200).json({ year: latestYears() })
}