# Version 2.0.2
- Renamed "Border everything" feature to "Outline everything"
- Bug fixes

# Version 2.0.1
- Removed custom objects
- Fixed enabler

# Version 2.0
- Refactored Code
- HTML is now an asset loaded through JS
- Rewritten variables with "_BT_" prefix + camelCase format
- Storage values are loaded all at once on startup. Updated individually
- Modified screenshot function to pass array of data, rather than query string
- Added comments above and below injected code to quickly spot BannerTools in the dev console
- BT code is no longer injected into ad-container
- Integrated SASS
- New UI & SVG icons
- AdGear Tester
- Enabler Detection (Buggy)
- New features: Reference images, playback, checkpoint
- Removed override
- You can now modify the object and element BT depends on
- Play/pause with spacebar
- Go to end with 1
- Go to start with 2

# Version 1.7
- Removed options
- Bug fixes

# Version 1.6
- Hooked into banner object
- Added feature to play / pause banner
- Updated screenshot to automatically go to last frame
- Fixed ruler overlay issue, not being visible at max point
- Fixed ruler max value issue, not being able to reach max point due to ruler width
- Removed timer feature
- Duration stays green when under 30, red at 30+
- Added feature for toast notifications

# Version 1.5
- Added shortcut ALT+X to disable BannerTools
- Edited console log messages

# Version 1.4
- Removed extraneous code.
- Refactor code.
- Added new feature to overlay grid.
- Added new feature to overlay rulers.
- Added back border feature as easter egg.
- Added shortcut ALT+Z to toggle BannerTools.
- Added options page, could have more potential.
- Page zoom sets 100% on screenshot.
- Modified make it black, now uses 90% opacity.
- Minified hover.css library

# Version 1.3
- Removed extraneous code.
- Added new feature to override adcontainer ID check.
- Banner Info displays width and height as one, under specs.
- Modified make it black, now uses 80% opacity.
- BannerTools version is now only visible if easteregg is enabled.
- MH Logo is now a local asset.
- BannerTools is now 200px, was 250px.
- Minified iOS styles.
- Added giant comments for fun.
- Organized project folder.

# Version 1.2
- Removed the secret option to add borders to all elements in ad-container, it was causing issues on some elements making them disappear. Needs to be fixed.

# Version 1.1
- Removed the staging div container, which basically grabs the current elements in the body and appends it to a div, and then the banner is prepended to the body, so as you expand/collapse the tool, you have this nice animation which slides the stage around, used to prevent the tool from overlaying the banner, occurs on smaller windows.

# Version 1.0
- Remade BannerTools from scratch.
- Faster and more reliable as it injects the BannerTools app directly into the banner page and works off a script on the same level as the banner.

# Version 0.0.x.x
- Initial release, testing key features and improvements. Worked off two main scripts and embedded within a popup window. Wasn't functioning properly, one of the main scripts wouldn't load sometimes.. Need to refactor..
