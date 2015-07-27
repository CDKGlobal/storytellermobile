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
#    {
#      title: "Filters"
#      id: "hashtags"
#      location: "consumer#settings" # URLs are supported!
#    }
  ]

  # rootView:
  #   location: "example#getting-started"

  preloads: [
    {
      id: "advanced-search"
      location: "consumer#advanced-search"
    }
  ]

  # drawers:
  #   left:
  #     id: "leftDrawer"
  #     location: "example#drawer"
  #     showOnAppLoad: false
  #   options:
  #     animation: "swingingDoor"
  #
  # initialView:
  #   id: "initialView"
  #   location: "example#initial-view"
