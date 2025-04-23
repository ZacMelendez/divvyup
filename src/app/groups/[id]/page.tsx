import GroupDetailPage from "./group-detail-page";
import { getGroup } from "@/app/actions";

export default async function Page({ params }: { params: { id: string } }) {
    const group = await getGroup(params.id);

    return <GroupDetailPage group={JSON.parse(group)} />;
}
