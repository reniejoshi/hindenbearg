import 'dotenv/config';

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on(["pull_request.opened", "pull_request.synchronize"], async (context) => {
    const action = context.payload.action;
    const prAuthor = context.payload.pull_request.user.login;

    const gifUrl = await getRandomGif('great-contribution');

    console.log(gifUrl);
    
    const prComment = context.issue({
      body:  `### 🔥 Great work! \n\n@${prAuthor} ` + (action == "pull_request.opened" ? 'opened' : 'updated') + ` a PR! \n\n![Hype GIF](${gifUrl})`,
    });

    return context.octokit.rest.issues.createComment(prComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};

async function getRandomGif(tag) {
  const defaultUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3h1enQ4NDhyYjB6cnNnN2xzZHZ3Y2U4eXQ1OGtxZGUxYTBmMGJ2biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/P53TSsopKicrm/giphy.gif";

  try {
    const apiKey = process.env.GIPHY_API_KEY;
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}&rating=g`;
    
    const response = await fetch(url);
    const json = await response.json();

    const gifUrl = json?.data?.images?.original?.url ?? defaultUrl;

    console.log(`GIF URL: ${gifUrl}`);

    return gifUrl;
  } catch (error) {
    console.error("getRandomGif() failed: ", error);
    return defaultUrl;
  }
}