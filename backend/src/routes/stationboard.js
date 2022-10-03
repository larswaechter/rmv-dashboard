const { Router } = require("express");

const { findAll } = require("../db/query");

router = Router();

router.get("", (req, res) => {
  res.json({
    DepartureBoard: {
      Departure: [
        {
          direction: "Gardermoen",
          name: "F2",
          trainNumber: "3781",
          trainCategory: "5",
          stopid: "A=1@O=Oslo S@X=10755332@Y=59910200\n@U=70@L=7600100@",
          stop: "Oslo S",
          date: "2014-06-01",
          time: "18:00:00",
          track: "13",
          JourneyDetailRef: {
            ref: "1|25|0|70|1062014",
            "self-closing": "true",
          },
        },
        {
          direction: "Göteborg C",
          name: "R20",
          trainNumber: "127",
          trainCategory: "2",
          stopid: "A=1@O=Oslo S@X=10755332@Y=59910200\n@U=70@L=7600100@",
          stop: "Oslo S",
          date: "2014-06-01",
          time: "18:02:00",
          track: "18",
          JourneyDetailRef: {
            ref: "1|1977|0|70|1062014",
            "self-closing": "true",
          },
        },
        {
          direction: "Skøyen",
          name: "L22",
          trainNumber: "1928",
          trainCategory: "5",
          stopid: "A=1@O=Oslo S@X=10755332@Y=59910200\n@U=70@L=7600100@",
          stop: "Oslo S",
          date: "2014-06-01",
          time: "18:03:00",
          track: "7",
          JourneyDetailRef: {
            ref: "1|329|0|70|1062014",
            "self-closing": "true",
          },
        },
      ],
    },
  });
});

module.exports = router;
