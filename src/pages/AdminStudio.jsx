import { Studio } from "sanity";
import sanityConfig from "../../sanity.config";

function AdminStudio() {
  return (
    <div className="admin_studio">
      <Studio config={sanityConfig} basePath="/admin" />
    </div>
  );
}

export default AdminStudio;
