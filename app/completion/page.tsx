import { NextResponse } from "next/server";
import { toast } from "sonner";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const position = { x: 0, y: 0 };
  try {
    const { prompt } = await req.json();

    // optional: use stream data

    // const result = await streamText({
    //   model: openai('gpt-3.5-turbo-instruct'),
    //   maxTokens: 1000,
    //   prompt,
    //   onFinish: () => {
    //     data.append('call completed');
    //     data.close();
    //   },
    // });
    // const result= await generateText({
    //   model: openai('gpt-3.5-turbo-instruct'),
    //   maxTokens: 1000,
    //   prompt,

    // });
    const result = {
      "01": {
        right: "02",
        source:
          "\n# Slide 1\n\n- This is the first slide\n- It has a right arrow to go to the next slide\n",
      },
      "02": {
        left: "01",
        right: "04",
        source:
          "\n# Slide 2\n\n- This is the second slide\n- It has a left arrow to go back to the first slide\n- It has an up arrow to go to the third slide\n- It has a right arrow to go to the fourth slide\n",
      },
      "03": {
        down: "02",
        source:
          "\n# Slide 3\n\n- This is the third slide\n- It has a down arrow to go back to the second slide\n",
      },
      "04": {
        left: "02",
        right: "05",
        source:
          "\n# Slide 4\n\n- This is the fourth slide\n- It has a left arrow to go back to the second slide\n",
      },
      "05": {
        left: "04",
        source:
          "\n# Slide 4\n\n- This is the fourth slide\n- It has a left arrow to go back to the second slide\n",
      },
    };
    console.log("result", result);

    // Respond with the stream
    console.log("esperando...");

    await sleep(1000);
    return NextResponse.json({ data: result, success: false });
  } catch (error) {
    NextResponse.json({
      error,
    });
  }
}
