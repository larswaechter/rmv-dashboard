const { Router } = require("express");

const { getJourney } = require("../../services/rmv");

router = Router();

router.get("/search", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.sendStatus(400);

  const journey = await getJourney(id);
  res.json(journey);
});

router.get("", (req, res) => {
  res.json({
    JourneyDetail: {
      Stops: {
        Stop: [
          {
            id: "A=1@O=Drammen@X=10204842@Y=59740160@U=70\n@L=7601421@",
            name: "Drammen",
            routeIdx: "0",
            extId: "7601421",
            lon: "10.204842",
            lat: "59.74016",
            depDate: "2014-06-01",
            depTime: "17:22:00",
            track: "3",
            "self-closing": "true",
          },
          {
            id: "A=1@O=Asker@X=10434552@Y=59833747@U=70@L=7601413@",
            name: "Asker",
            routeIdx: "1",
            extId: "7601413",
            lon: "10.434552",
            lat: "59.833747",
            depDate: "2014-06-01",
            depTime: "17:35:00",
            track: "3",
            "self-closing": "true",
          },
          {
            id: "A=1@O=Sandvika@X=10526017@Y=59893022@U=70\n@L=7601408@",
            name: "Sandvika",
            routeIdx: "2",
            extId: "7601408",
            lon: "10.526017",
            lat: "59.893022",
            depDate: "2014-06-01",
            depTime: "17:41:00",
            track: "4",
            "self-closing": "true",
          },
        ],
      },
    },
  });
});

module.exports = router;
