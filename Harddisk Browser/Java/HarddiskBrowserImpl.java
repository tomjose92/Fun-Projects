package harddisk.browser;
            
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.File;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

public class HarddiskBrowserImpl extends CommonUtil
{
      public static void main(String args[])
	{
		try{
                  List <String> media = new ArrayList();
                  if(args.length>0)
                  {
                        for(int i=0;i<args.length;i++)
                        {
                              media.add(args[i].toUpperCase());
                        }
                  }
                  
                  if(media.contains("MOVIES") || media.size()==0)
                  {
                        if(props.get("TV_SHOW_FOLDER")==null)
                        {
                              System.out.println("Cannot find Movie folder name from .conf file");
                              return;
                        }

                        System.out.println("\nMOVIE_HTML_PATH " + MOVIE_HTML_PATH);
                        String moviesContent = MovieList.listMovies();      
                        if(moviesContent!=null)     
                        {
                              getHTMLContent(MOVIE_HTML_PATH,moviesContent);
                        }
                  }
                  
                  if(media.contains("TVSHOWS") || media.size()==0)
                  {
                        if(props.get("TV_SHOW_FOLDER")==null)
                        {
                              System.out.println("Cannot find TV Show folder name from .conf file");
                              return;
                        }
                        System.out.println("\nTV_SHOW_HTML_PATH " + TV_SHOW_HTML_PATH);
                        String tvShowsContent = TVShowsList.listTVShows(); 
                        if(tvShowsContent!=null)     
                        {
                              getHTMLContent(TV_SHOW_HTML_PATH,tvShowsContent);
                        }
                  }

                  CommonDBUtil.dumpMySqlData();
      	}
      	catch(Exception e)
      	{
      		e.printStackTrace();
      	}
	}

      public static void getHTMLContent(String filePath, String content) throws Exception
      {
            File file;
            BufferedReader br =null;
            try {

                  file = new File(filePath);
                  if (!file.exists()) {
                        System.out.println("File does not exist.");
                        return;
                  }

                  br =new BufferedReader(new FileReader(file));

                  String line="";
                  boolean beginningFlag = false;
                  String contentToWrite = "";

                  while ((line = br.readLine()) != null) {
                        if(!beginningFlag || line.contains("<!--  Ending -->"))  
                        {
                              if (line.contains("<!--  Beginning -->")) {
                                    beginningFlag=true;
                              }
                              else if(line.contains("<!--  Ending -->"))
                              {
                                    contentToWrite+=content+"\n";
                                    beginningFlag=false;
                              }
                              contentToWrite+=line+"\n";
                        }
                  }

                  br.close();
                  writeFile(filePath,contentToWrite);
            }catch(IOException e){
                  e.printStackTrace();
            }
      }
}

