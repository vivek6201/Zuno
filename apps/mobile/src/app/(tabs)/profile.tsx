import React from "react";
import BottomSheetLayout from "@/components/common/bottom-sheet-layout";
import {
  ProfileHeader,
  ProfileStatsCard,
  ProfileMenuCard,
  ProfileLogoutButton,
} from "@/components/tabs/profile";

const Profile = () => {
  return (
    <BottomSheetLayout
      header={<ProfileHeader />}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 110,
        gap: 14,
      }}
    >
      {/* 1. Stats Card (Games Played, Wins, Losses) */}
      <ProfileStatsCard />

      {/* 2. Menu Navigation List (Edit Profile, Notifications, Help & Support) */}
      <ProfileMenuCard />

      {/* 3. Separate Red Gradient Log Out Button */}
      <ProfileLogoutButton />
    </BottomSheetLayout>
  );
};

export default Profile;
