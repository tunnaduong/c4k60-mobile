const menuData = [
  {
    title: "Thư viện ảnh",
    iconName: "images",
    bgColor: ["#C9A00D", "#F4DE19"],
    route: "GalleryScreen",
    guestEnabled: true,
  },
  {
    title: "Sinh nhật sắp tới",
    iconName: "gift",
    bgColor: ["#9E0000", "#F86767"],
    route: "IncomingBirthday",
    guestEnabled: true,
  },
  {
    title: "Hồ sơ thành viên",
    iconName: "people",
    bgColor: ["#3AB700", "#74EB3D"],
    route: "StudentProfile",
    guestEnabled: true,
  },
  {
    title: "Bạn bè gần đây",
    iconName: "location",
    bgColor: ["#9B008C", "#ED2BDA"],
    route: "FriendNearby",
    guestEnabled: false,
  },
  {
    title: "Nghe nhạc cùng nhau",
    iconName: "musical-notes",
    bgColor: ["#009E78", "#17EAB7"],
    route: "MusicScreen",
    guestEnabled: false,
  },
  {
    title: "Lịch",
    iconName: "calendar",
    bgColor: ["#9B0041", "#F84A9D"],
    route: "CalendarScreen",
    guestEnabled: true,
  },
];

export default menuData;
