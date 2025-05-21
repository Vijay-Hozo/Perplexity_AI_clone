// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const { userInput, searchType } = await req.json();

//   const res = await axios.get(
//     "https://api.search.brave.com/res/v1/web/search?q=" + userInput + '&count=5',
//     {
//       headers: {
//         Accept: "application/json",
//         "Accept-Encoding": "gzip",
//         "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY,
//       },
//     }
//   );
//   return NextResponse.json(res.data);
// }

import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { searchInput, searchType } = await req.json();

    if (!searchInput) {
      return NextResponse.json(
        { error: "Search input is required" },
        { status: 400 }
      );
    }
    if (searchInput) {
      const res = await axios.get(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
          searchInput
        )}&count=5`,
        {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip",
            "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY,
          },
        }
      );

      return NextResponse.json(res.data);
    }else{
      return NextResponse.json(
        { error: "Search input is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Brave API error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
