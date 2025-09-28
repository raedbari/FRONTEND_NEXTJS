import Overview from "@/components/monitor/Overview";
import Charts from "@/components/monitor/Charts";
import Logs from "@/components/monitor/Logs";
import Pods from "@/components/monitor/Pods";
import Events from "@/components/monitor/Events";

export default function Page({ params }:{params:{namespace:string;app:string}}){
  const { namespace, app } = params;
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">{namespace} / {app}</h1>
      <Overview ns={namespace} app={app}/>
      <div className="grid md:grid-cols-2 gap-6">
        <Charts ns={namespace} app={app}/>
        <Logs   ns={namespace} app={app}/>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Pods   ns={namespace} app={app}/>
        <Events ns={namespace} app={app}/>
      </div>
    </div>
  );
}
