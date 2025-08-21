import FileUpload from "../../components/ui/FileUpload";
import { parseXlsxFileToJson } from "../../data/xlsxParser";
import parseRegistrationJson from "../../data/registrationParser";

const Upload = () => {
  return ( 
    <section className="upload" id="upload">
      <h1>Upload Your Workday Data</h1>
      <FileUpload onChange={(files) => {
        if (files && files.length > 0) {
          parseXlsxFileToJson(files[0])
            .then(json => {
              const filtered = parseRegistrationJson(json);
              console.log('Filtered registrations:', filtered);
            })
            .catch(err => console.error("Failed to parse xlsx:", err));
        }
      }} />
    </section> 
  );
}
 
export default Upload;