# Coding Challenge Guidelines

Please organize, design, test, document and deploy your code as if it were going into production, then send us a link to the hosted repository (e.g. Github, Bitbucket...).

## Functional spec

Create a front-end application that draws a 3-dimensional visualization of the social posts.

The 3 dimensions should be:

- Day of the week
- Hour of the day (UTC time)
- Number of post matching the two other dimensions

### Input stream

Upfluence has a publicly available HTTP API endpoint streaming some of the posts processed by our system in real-time (It uses SSE technology).

You can find this stream here: <https://stream.upfluence.co/stream>

### Structure of the payload

Each payload sent are `JSON` encoded. The payload has one pair of key-value.

The key is the type of social post.

It can be:

- `pin`
- `instagram_media`
- `youtube_video`
- `article`
- `tweet`
- `facebook_status`

The value is a set of key values with some details about the post including the key `timestamp` representing the creation date of the post encoded as a _UNIX_ timestamp

### Rendering

You can display the information using the rendering you want; however, we recommend using a punch card system in order to keep it simple.

Here an example:

![punch card example](https://i.stack.imgur.com/2vX3Z.png)

## Technical spec

The front-end might consume the streaming back-end.

For each post type (cf. Structure of the payload), display one instance of the visualization along with a counter of the number of posts processed.

The latency between the reception of the post and the update of the page should not exceed **5 seconds**

## Expected output

### Readme

Write your README as if it was for a production service. Include the following items:

- Description of your solution.
- Reasoning behind your technical choices, including architectural.
- Trade-offs you might have made, anything you left out, or what you might do differently if you were to spend additional time on the project.

### How we review

Your application will be reviewed by at least three of our engineers. We do take into consideration your experience level.

We value quality over feature-completeness. It is fine to leave things aside provided you call them out in your project's `README`. The goal of this code sample is to help us identify what you consider production-ready code. You should consider this code ready for final review with your colleague, i.e. this would be the last step before deploying to production.

The aspects of your code we will assess include:

- **Architecture**: How clean is the separation between the different components of the front end? How well are the different classes separated?
- **Clarity**: Does the README clearly and concisely explain the problem and solution? Are technical trade-offs explained?
- **Correctness**: Does the application do what was asked? If there is anything missing, does the README explain why it is missing?
- **Code quality**: Is the code simple, easy to understand, and maintainable? Are there any code smells or other red flags? Is the coding style consistent with the language's guidelines? Is it consistent throughout the codebase?
- **UX**: Is the web interface understandable and pleasing to use?
- **Technical choices**: do choices of libraries, architecture etc. seem appropriate for the chosen application?

Bonus point (those items are optional):

- **Scalability**: Will technical choices scale well (increase of the post throughput) ? If not, is there a discussion of those choices in the README?
- **Upfluence ready**: Are the technologies you are using similar to the one used at Upfluence? Is the frontend written using Ember.js?
