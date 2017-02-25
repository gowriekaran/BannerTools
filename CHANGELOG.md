# Version 1.3
- Cleaned project

# Version 1.2
- Removed the secret option to add borders to all elements in ad-container, it was causing issues on some elements making them disappear. Needs to be fixed.

# Version 1.1
- Removed the staging div container, which basically grabs the current elements in the body and appends it to a div, and then the banner is prepended to the body, so as you expand/collapse the tool, you have this nice animation which slides the stage around, used to prevent the tool from overlaying the banner, occurs on smaller windows.

# Version 1.0
- Remade BannerTools from scratch.
- Faster and more reliable as it injects the BannerTools app directly into the banner page and works off a script on the same level as the banner.

# Version 0.0.x.x
- Initial release, testing key features and improvements. Worked off two main scripts and embedded within a popup window. Wasn't functioning properly, one of the main scripts wouldn't load sometimes.. Need to refactor..