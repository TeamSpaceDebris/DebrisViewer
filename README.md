# Dear My Space Debris 2015

Show Space Debris realtime location and Space Debris information.
We plan to develop more action.

# Data

We use [Two-line element set](http://en.wikipedia.org/wiki/Two-line_element_set) data provide by [space-track.org](https://www.space-track.org).

# Demo Site

http://teamspacedebris.github.io/DebrisViewer/

This site allow some query strings:

- data_type: choose data
  - check: 999 items for debug
  - small: 5000 items
  - all: all items
- show_payload: if set false, show only debris and R/B
- seki: if set true, all items show [hal_sk](https://github.com/halsk)

http://teamspacedebris.github.io/DebrisViewer/?data_type=small&seki=true

# Who is Seki?

Hal Seki is organizer of ISAC 2012 and 2013.

# Libraries

- [orb.js](https://github.com/lizard-isana/orb.js/) : calculate positions
- [Cesium](http://cesiumjs.org/) : visualize

# License

MIT License
