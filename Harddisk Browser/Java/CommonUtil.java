package harddisk.browser;

import java.io.File;
import java.io.IOException;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;

import java.util.Properties;
import java.util.Arrays;
import java.util.List;

public class CommonUtil extends MediaConstants
{
      public static Properties props=new Properties();
      public static String FILE_PATH="";
      static 
      {
            try
            {
                  if(!new File(MEDIA_CONSTANTS).exists())
                  {
                        System.out.println("Cannot Find Conf File");
                  }     
                  else
                  {
                        props=getProperties(MEDIA_CONSTANTS);
                        if(props.get("FILE_PATH")==null)
                        {
                              System.out.println("File Path entry is missing in Conf File");
                              System.exit(0);
                        }
                        else
                        {
                              FILE_PATH=props.get("FILE_PATH").toString();
                        }
                  }
            }
            catch(Exception e)
            {
                  e.printStackTrace();
            }
      }
      
      /* 
            Gets the properties of the file CONF_FILE_NAME
      */
      public static Properties getProperties(String confFileName)
      {
            Properties props = new Properties();
            FileInputStream fis = null;

            try
            {
                  if((new File(confFileName).exists()))
                  {
                        fis = new FileInputStream(confFileName);
                        props.load(fis);
                        fis.close();
                  }
            }
            catch(Exception ex)
            {
                  ex.printStackTrace();
            }
            finally
            {
                  try
                  {                
                        if (fis != null)
                        {
                              fis.close();
                        }
                  }
                  catch(Exception ex)
                  {
                        ex.printStackTrace();
                  }
            }
            return props;
      }

      public static void writeFile(String filePath, String content) 
      {
            FileOutputStream fop = null;
            File file;

            try {

                  file = new File(filePath);
                  fop = new FileOutputStream(file);

                  // if file doesnt exists, then create it
                  if (!file.exists()) {
                        file.createNewFile();
                  }

                  // get the content in bytes
                  byte[] contentInBytes = content.getBytes();

                  fop.write(contentInBytes);
                  fop.flush();
                  fop.close();

                  System.out.println("Done");

            } catch (IOException e) {
                  e.printStackTrace();
            } finally {
                  try {
                        if (fop != null) {
                              fop.close();
                        }
                  } catch (IOException e) {
                        e.printStackTrace();
                  }
            }
      }

      public static void process(String location)
      {
            try
            {
                  String[] command = {location};
                  Process p = Runtime.getRuntime().exec(command);
            }
            catch (Exception e)
            {
                  e.printStackTrace();
                  System.out.println("Error occured in process()");
            }
      }

      public static void main(String args[])
      {
            System.out.println("props " + props);
            //process(SQL_DUMP_COMMAND);
      }

}

