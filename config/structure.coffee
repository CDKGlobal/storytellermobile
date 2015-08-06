# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  rootView:
    location: "consumer#index"

  preloads: [
    {
      id: "index"
      location: "consumer#index"
    }
    {
      id: "advanced-search"
      location: "consumer#advanced-search"
    }
    {
      id: "story-stream"
      location: "consumer#story-stream"
    }
  ]
