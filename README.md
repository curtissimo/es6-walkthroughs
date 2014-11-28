# ECMAscript 6 Walkthroughs

Contains a collection of walkthroughs and examples for the new and upcoming features in ECMAscript 6.

## How to contribute a narrated tutorial

Remember that we provide content about *ECMAscript*, not "*JavaScript*". Please
ensure that you refer to it by its real name.

1. Choose a tutorial that you want to create from the list of open issues and
   assign yourself to the task (if you're on the team) or comment that you want
   to provide the content.
1. Branch `gh-pages` 
1. Find the tutorial that you chose in the first step in `_src/index.json` so
   you can
   * Remove the `"state": "not-ready"` entry; and,
   * Create a "filename" entry with the name of the html file name that you want
     generated.
1. Write a script for the walkthrough and include the text "I, [your name],
   license this script under the Attribution-NonCommercial-ShareAlike 4.0
   International (CC BY-NC-SA 4.0)"
1. Save the script into the _scripts subdirectory.
1. Record the script, perform any post-production work to make it sound really
   good, and save it in two formats with the base file name equivalent to the
   file name of the tutorial (found in the `index.json`):
   * **MP3**: Tag it with _CC A-NC-SA 4.0 International License_ as indicated in
     [https://wiki.creativecommons.org/MP3](https://wiki.creativecommons.org/MP3)
   * **OGG**: Tag the LICENSE field with the URL http://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
1. Add an entry in the `index.json` in the object for the tutorial that you
   chose in the first step with the key `"audioSources"` and list the
   two file names that you created in the previous step.
1. Add an entry in the `index.json` in the object for the tutorial that you
   chose in the first step with the key `"keyframes"` with an object value
   whose keys are the number of seconds into the recorded script that you want
   to insert text and whose values are the text that you want the tutorial to
   enter into the editor.
1. Add an entry in the `index.json` in the object for the tutorial that you
   chose in the first step with the key `"author"` with an object value whose
   keys are `"name"` and `"url"` and whose values are your name and a URL to
   your presence on the Web, respectively. This will allow the correct copyright
   to display on the page.
1. Put your audio files in the top-level `narrated-walkthroughs` directory.
1. Commit. Push. Pull request.

Following those rules, you will find an entry in the `index.json` file that
looks like this:

```json
{
  "title": "Walkthrough",
  "keys": [ "key1", "key2" ],
  "state": "not-ready"
}
```

and you will change it to look like this:

```json
{
  "title": "Walkthrough",
  "filename": "walkthrough.html",
  "keys": [ "key1", "key2" ],
  "author": {
    "name": "[Your Name Here]",
    "url": "[Your URL Here]"
  },
  "audioSources": [ "walkthrough.ogg", "walkthrough.mp3" ],
  "keyframes": {
    "2": "The tutorial will append this text to the content of the editor after two seconds elapses and execute the contents of the editor.",
    "8.43": {
      "text": "The tutorial will insert this text at the beginning after 8.43 seconds elapses and do nothing afterward.",
      "position": "start",
      "replActions": []
    },
    "90": {
      "text": "After a minute and a half, this text will replace the entire content of the editor, clear the console, and execute the contents of the editor.",
      "position": "replace",
      "replActions": [ "clear", "evaluate" ]
    }
  }
}
```

### Available values for "position"

You can use any of the following values for "position" in your keyframes. The
default value is "end".

* "start"
* "end"
* "replace"

### Available values for "replActions"

You can use any of the following values in the "replActions" list. The default
value is [ "clear", "evaluate" ].

* "clear"
* "evaluate"

## Local testing

A simple static server has been included and requires nodejs. A package.json has been included for installing dependencies. To install and run:

```shell
git clone https://github.com/realistschuckle/es6-walkthroughs.git
npm install
gulp dev
```

Change ES6 modules in `_assets` and **gulp** will build the ES5 versions and
put them in `assets`. When you commit, commit the changes in both `_assets` and
`assets` so GitHub pages will work appropriately.
