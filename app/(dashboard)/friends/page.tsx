import { createClient } from "@/lib/supabase/server";
import FriendsClient from "./FriendsClient";

export default async function FriendsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get friends (accepted requests where user is sender or receiver)
  const { data: sentRequests } = await supabase
    .from("friend_requests")
    .select("*, receiver:profiles!receiver_id(id, display_name, email)")
    .eq("sender_id", user!.id)
    .eq("status", "accepted");

  const { data: receivedRequests } = await supabase
    .from("friend_requests")
    .select("*, sender:profiles!sender_id(id, display_name, email)")
    .eq("receiver_id", user!.id)
    .eq("status", "accepted");

  const { data: pendingReceived } = await supabase
    .from("friend_requests")
    .select("*, sender:profiles!sender_id(id, display_name, email)")
    .eq("receiver_id", user!.id)
    .eq("status", "pending");

  // Get shared sermons from friends
  const friendIds = [
    ...(sentRequests ?? []).map((r: any) => r.receiver?.id),
    ...(receivedRequests ?? []).map((r: any) => r.sender?.id),
  ].filter(Boolean);

  const { data: friendSermons } = friendIds.length
    ? await supabase
        .from("sermons")
        .select("*, profiles!user_id(display_name)")
        .in("user_id", friendIds)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(10)
    : { data: [] };

  return (
    <FriendsClient
      currentUserId={user!.id}
      friends={[
        ...(sentRequests ?? []).map((r: any) => r.receiver),
        ...(receivedRequests ?? []).map((r: any) => r.sender),
      ].filter(Boolean)}
      pendingRequests={pendingReceived ?? []}
      friendSermons={friendSermons ?? []}
    />
  );
}
