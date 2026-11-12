// [brand-social-studio] Working example from the Reliance MET City calendar (Nov 2026). Paths, brand names, layouts and data are MET City specific: copy into the project and adapt.
// Real photo sources for calendar v2 (paths under ../research or ../real/photos). t = video frame time, crop = [w,h,x,y].
// MET City's own Instagram images (research/ig-full/img), their videos, and two Wikimedia Commons photos.
module.exports = {
  // Already cropped in the first real-photo pass (../real/photos)
  road: { r: "road.jpg" }, command: { r: "command.jpg" }, commandSq: { r: "commandSq.jpg" }, solar: { r: "solar.jpg" }, solarSq: { r: "solarSq.jpg" },
  starRound: { r: "starRound.jpg" }, starTile: { r: "starTile.jpg" }, plots: { r: "plots.jpg" }, tower: { r: "tower.jpg" },
  factoryV: { r: "factoryV.jpg" }, factoryV2: { r: "factoryV2.jpg" }, clubDusk: { r: "clubDusk.jpg" }, clubNight: { r: "clubNight.jpg" },
  clubDay: { r: "clubDay.jpg" }, clubOpen: { r: "clubOpen.jpg" }, celBuild: { r: "celBuild.jpg" }, celBuildSq: { r: "celBuildSq.jpg" },
  dhirubhai: { r: "dhirubhai.jpg" }, goldRoad: { r: "goldRoad.jpg" }, goldRoadTile: { r: "goldRoadTile.jpg" }, pergola: { r: "pergola.jpg" },
  // Half Marathon (@reliance_met thank-you carousel, 26 Oct 2026; @metcityhalfmarathon)
  mar1: { f: "ig-full/img/De9XB6jkuvu_1.jpg" }, mar7: { f: "ig-full/img/De9XB6jkuvu_7.jpg" }, mar8: { f: "ig-full/img/De9XB6jkuvu_8.jpg" },
  mar10: { f: "ig-full/img/De9XB6jkuvu_10.jpg" }, mar5: { f: "ig-full/img/De9XB6jkuvu_5.jpg" }, mar6: { f: "ig-full/img/De9XB6jkuvu_6.jpg" },
  so: { f: "ig-full/img/DfD_ziCjD_R_2.jpg", crop: [940, 900, 70, 190] },
  gate: { f: "yt1080/20251130_TLDU2WczFxI.mp4", t: 0.5, crop: [1080, 1000, 0, 920] },
  living: { r: "living.jpg" }, golden: { r: "golden.jpg" },
  mar9: { f: "ig-full/img/De9XB6jkuvu_9.jpg" }, mar16: { f: "ig-full/img/De9XB6jkuvu_16.jpg" }, mar2: { f: "ig-full/img/De9XB6jkuvu_2.jpg" }, mar11: { f: "ig-full/img/De9XB6jkuvu_11.jpg" }, mar14: { f: "ig-full/img/De9XB6jkuvu_14.jpg" }, mar3: { f: "ig-full/img/De9XB6jkuvu_3.jpg" },
  // Water treatment plant and substation (MET City shorts, 1080x1920)
  wtp: { f: "yt1080/20251130_TLDU2WczFxI.mp4", t: 27.0, crop: [1080, 1350, 0, 300] },
  substation: { f: "yt1080/20260928_gX2ji0O7EKY.mp4", t: 22.7, crop: [1000, 1000, 40, 800] },
  // Japan Industrial Township: Panasonic testimonial aerial (above subtitles), Japanese delegation at the Club (26 Jun 2026)
  panAerial: { f: "web/files/2026-06_Panasonic-Compressed.mp4", t: 30.2, crop: [1920, 900, 0, 0] },
  nihon: { f: "web/files/2026-06_Nihon-Kohden-Compressed.mp4", t: 25.6, crop: [1920, 900, 0, 0] },
  japanDel: { f: "ig-full/img/DaCf5l_CcsN_1.jpg" },
  // Club (its own reel, 720x1280)
  clubFood: { f: "ig/DdG1V12p0je.mp4", t: 12, crop: [720, 900, 0, 190] },
  clubLobby: { f: "yt1080/20260519_rIoaKXM8rfM.mp4", t: 15.8, crop: [1700, 1000, 100, 60] },
  // 2026 milestones (their own posts)
  leed: { f: "ig-full/img/DVQJKAdE5Vs_1.jpg" }, mou: { f: "ig-full/img/DZXUDsZEmRY_1.jpg" }, igbcFm: { f: "ig-full/img/DaNMljnktPr_1.jpg" },
  // Wikimedia Commons (credited in research/SOURCES.md)
  sultanpurNP: { f: "commons/Sultanpur_Bird_Sanctuary_Haryana..JPG" },
};
