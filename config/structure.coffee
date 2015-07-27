# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Index"
      id: "index"
      location: "consumer#index" # Supersonic module#view type navigation
    }
    {
      title: "Settings"
      id: "settings"
      location: "consumer#settings"
    }
  ]

  preloads: [
    {
      id: "advanced-search"
      location: "consumer#advanced-search"
    }
  ]
