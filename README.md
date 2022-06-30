# Browser Project Assessment
Chrome extension, Manifest V3. 
## Tools Used
#### Frameworks and libs: 
*  React 18, SWR, react-error-boundary, MUI, Emotion, Typescript
#### CI/CD / versioning / linting / testing / docs
* Incorporated in github actions: Vitest, ESLINT, Prettier, Typescript typechecking at build and PR.
* JSDOC style commenting and half-implemented last-minute Typedoc documentation accessible in /docs -- explanation below
#### Build tools
* Vite, Rollup. Configured two separate tsconfigs which pointed to two separate vite configs with different rollup options. 

## How to run: 
Once you've unzipped the files or cloned/forked this directory, ensure node_modules are present. They shouldn't be present if you cloned/forked, so execute ```yarn add``` or ```npm i``` in terminal/shell to download the packages specified in the package.json. Head on over to the "manage extensions" page in chrome, and choose either "load unpacked" or "load packed". Specify the /dist directory as your target and submit the file upload form. Enable the extension and navigate to google.com, submit a search to navigate to the /search page where the extension functionality is located. 

## Prompt: 
(On a particular search engine)

1: Change the background of ADS to RED

2: Append all queries to include the string "in 2021", and to have it reflected in the search results

3: Show the user the amount of ads they encountered in the past 24 hours.

## Design Considerations

* As a user, I want (each of the bullets in the prompt above)
* As a user, I would like to have status of the "append 2021" functionality indicated to me before I execute a query
* As a user, I want the ability to be able to toggle that functionality off.
* As a user, I really do not enjoy "interstitial renders" or flashes of alternate content while navigating.
* As a user, I want the extension to be available without force-installing it.

There are additional, not included, sketches and lo-fi wireframes that highlight UI concerns and application architecture. While implementing my preferred methods of achieving the specifications of the prompt, I kept on encountering issues regarding certain APIs being deprecated within the last month by google. After workshopping declarativeNetRequest, tabs, scripting, and webRequest APIs and reading mountains of documentation, I decided to pivot and manipulate the elements directly to achieve my goals.

Initially, it had felt "hacky" to me, but with the addition of a visual indicator of "what is happening" in regards to the append functionality, it placated my concern about it being "completely horrible UX". 

## Architecture

The first implementations of the features in the prompt leaned more heavily on the service worker, with the content script being solely concerned with the presentation layer of the application. I realized that leaning too heavily on the service worker introduced some weirdness when the worker would "sleep" or the user would navigate mid-task. 

The architecture is currently as follows: Dom manipulation and tasks related to visual content and navigation/form submission take place in the content script, and the "ad-tracking" tasks are dispatched to the worker. Rather than tying up the worker thread with constantly filtering the "old" ( > 24hrs) ad-encounters, I determined that tying that operation to the retrieval of information for the presentation layer. By making this process somewhat incidental and concurrent with tasks for procuring data to fulfill UI requirements, the state is always consistent between the UI and storage. In off-the-happy-path scenarios, the UI does not display inconsistent data, but renders an error.

## Etc.

I included the ability to toggle the append feature, which seemed like the only way to keep my sanity while testing the application. I abandoned the workflow of writing tests in vitest, as I determined the energy expenditure involved in mocking chrome APIs -> hitting unrelated obstacles regarding API quirks  -> rewriting tests, etc... just wasn't worth it for the assessment. I also discarded the idea of implementing storybook, as the focus on the visual aspect of the UI wasn't the primary axis on which things were being evaluated. 

## Pictures <img width="1300" alt="Screen Shot 2022-06-30 at 4 21 09 AM" src="https://user-images.githubusercontent.com/90824757/176669275-489d1681-a8d7-4bb8-a2fc-25072e2d36df.png">
![Uploading Screen ![Uploadin<img width="1196" alt="Screen Shot 2022-06-30 at 4 22 30 AM" src="https://user-images.githubusercontent.com/90824757/176669301-112a2c73-48a9-49ed-8ba8-49b2e392d7e6.png">
g Screen Shot 2022-06-30 at 4.20.09 AM.png…]()
Shot 2022-06-30 at 4.20.54 AM.png…]()
