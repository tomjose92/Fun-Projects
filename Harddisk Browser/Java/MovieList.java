package harddisk.browser;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.File;
import java.io.InputStreamReader;
import java.io.BufferedReader;

import java.util.Iterator;
import java.util.ArrayList;
import java.util.List;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Properties;

import org.json.JSONObject;
import org.json.JSONArray;

import org.apache.commons.io.FileUtils;

public class MovieList extends CommonUtil
{
      public static final String LETTER_ELEMENT ="<span class=\"space-20\"></span>\n<a class=\"letter-font\" href=\"#LETTER\">LETTER</a>\n";
      public static final String LETTER_ID ="\t<a name=\"LETTER\"></a><div class=\"ml50 ffCur fs25 pt100\">Starts with LETTER</div>\n";
      public static final String MOVIE_ELEMENT ="\n\t<div class=\"pt20 ml50 fui-folder text-nowrap\">\n\t\t<a class=\"folder ml10 ffFant fs20\">MOVIE_FOLDER</a>MOVIE_ICON|SUBTITLE_ICON\n\t"+ /*<div class=\"fui-triangle-right-large file ml50\">^***<a href=\"MOVIE_URL\" class=\"ml10 filename ffFant fs15\">MOVIE_NAME</a>^**</div>^**SUBTITLE*/ "</div>\n\t";
      public static final String SUBTITLE_ELEMENT="<div class=\"fui-triangle-right-large subtitle ml50\">\n\t\t\t<a href=\"SUBTITLE_URL\" class=\"ml10 filename ffFant fs15\">SUBTITLE_NAME</a>\n\t\t</div>";
      public static final String SUBTITLE_ICON="\n\t\t<span class=\"space-20\"></span><a href=\"SUBTITLE_URL\"><img class=\"icon\" src=\"img/icons/svg/closed-captioning.svg\"></a>";
      public static final String MOVIE_ICON="\n\t\t<span class=\"space-20\"></span><a href=\"MOVIE_URL\"><img class=\"icon\" src=\"img/icons/svg/video-player.svg\"></a>";
      
      public static int action=2;
	public static void main(String args[])
	{
		try{
                  if(props.get("MOVIE_FOLDER")==null)
                  {
                        System.out.println("Unable to retrieve Movie folder name from .conf file");
                        return;
                  }
                  if(args.length>0)
                  {
                        action=Integer.parseInt(args[0]);
                  }
                  
                  listMovies();
      	}

      	catch(Exception e)
      	{
      		e.printStackTrace();
      	}
	}

      public static String listMovies() throws Exception
      {
            System.out.println("\n******************************* List Movie Files ******************************");
            String filesHomeName=props.get("MOVIE_FOLDER").toString();
            File filesHome = new File(filesHomeName);     //NO I18N

            if(!filesHome.exists())
            {
                  System.out.println("Movies Home Folder not found");
                  return null;
            }
            
            String []extensions={"mkv","mp4","avi"};  //NO I18N
            boolean recursive =true;
            Collection files= FileUtils.listFiles(filesHome,extensions,recursive);
            List <String> fileNames = new ArrayList();
            
            JSONObject fileDetails = new JSONObject();
            for(Iterator i=files.iterator();i.hasNext();)
            {
                  File file=(File)i.next();
                  //System.out.println("File Name " + file.getName());
                  JSONObject fileInfo = new JSONObject();
                  String fileName = file.getName().toUpperCase();
                  fileName=fileName.substring(0,fileName.lastIndexOf("."));
                  fileInfo.put("MOVIE_NAME",fileName);
                  fileNames.add(file.getName().toUpperCase());
                  String filePath = file.getAbsolutePath();
                  fileInfo.put("MOVIE_URL","");
                  filePath = filePath.substring(0,filePath.lastIndexOf("/"));
                  fileInfo.put("SUBTITLE",getSubtitles(filePath));
                  fileDetails.put(file.getName().toUpperCase(),fileInfo);
            }
            Collections.sort(fileNames);
            char letter='A';
            String contentToWrite="";
            String movieContent=LETTER_ID.replaceAll("LETTER","0123");
            String letterContent=LETTER_ELEMENT.replace("LETTER","0123")+"**";;
            JSONArray data = new JSONArray();
            int i=0;
            for(String file:fileNames)
            {
                  i++;
                  JSONObject json =  new JSONObject();
                  json.put("MOVIE_NAME",file);
                  json.put("MOVIE_ID",i);
                  json.put("LETTER","");
                  //System.out.println(filePaths.getString(file));     
                  if(letter>='A' && letter<='Z' && file.toUpperCase().startsWith(String.valueOf(letter)))
                  {
                        //System.out.println("File Name " + file);
                        json.put("LETTER",String.valueOf(letter));
                        letterContent+=LETTER_ELEMENT.replaceAll("LETTER",String.valueOf(letter))+"**";
                        movieContent+=LETTER_ID.replace("LETTER",String.valueOf(letter));
                        letter++;
                  }
                  if(i==1 && json.getString("LETTER").equals(""))
                  {
                        json.put("LETTER","0123");
                  }
                  String divMovieElement = MOVIE_ELEMENT;
                  JSONObject fileInfo = fileDetails.getJSONObject(file);
                  System.out.println("fileInfo "  + fileInfo);
                  if(fileInfo.has("SUBTITLE"))
                  {
                        json.put("HAS_SUBTITLE","true");
                        JSONObject subtitle  = fileInfo.getJSONObject("SUBTITLE");
                        String divSubtitleIcon = SUBTITLE_ICON;
                        divSubtitleIcon = divSubtitleIcon.replace("SUBTITLE_URL",subtitle.getString("SUBTITLE_URL"));      
                        divMovieElement=divMovieElement.replace("SUBTITLE_ICON",divSubtitleIcon);

                        String divSubtitleElement = SUBTITLE_ELEMENT;
                        divSubtitleElement=divSubtitleElement.replace("SUBTITLE_NAME",subtitle.getString("SUBTITLE_NAME"));
                        divSubtitleElement=divSubtitleElement.replace("SUBTITLE_URL",subtitle.getString("SUBTITLE_URL"));      
                        divMovieElement=divMovieElement.replace("SUBTITLE",divSubtitleElement);
                  }
                  else
                  {
                        json.put("HAS_SUBTITLE","false");
                        divMovieElement=divMovieElement.replace("SUBTITLE_ICON","");
                        divMovieElement=divMovieElement.replace("SUBTITLE","");     
                  }
                  
                  divMovieElement=divMovieElement.replace("MOVIE_FOLDER",fileInfo.getString("MOVIE_NAME"));
                  divMovieElement=divMovieElement.replace("MOVIE_NAME",file);
                  divMovieElement=divMovieElement.replace("MOVIE_URL",fileInfo.getString("MOVIE_URL"));

                  String divMovieIconElement=MOVIE_ICON;
                  divMovieIconElement=divMovieIconElement.replace("MOVIE_URL",fileInfo.getString("MOVIE_URL"));
                  divMovieElement=divMovieElement.replace("MOVIE_ICON",divMovieIconElement);
                  
                  movieContent+=divMovieElement;
                  System.out.println(divMovieElement);   
                  data.put(json);
            }
            if(action==1 || action==0)
            {
                  contentToWrite+="<div class=\"letter-box\"><ul class=\"pagination\">**"+letterContent+"</ul></div>**</nav>\n\t\t";
            }
            if(action==2 || action==0)
            {
                  contentToWrite+=movieContent;
            }
            writeFile(REACT_JSON_FOLDER + "movie.json",data);
            writeFile("MOVIE_DIV_ELEMENTS.txt",contentToWrite);
            System.out.println("No of movies " + fileNames.size());
            CommonDBUtil.addMovieData(data);
            
            return contentToWrite;
      }

      public static JSONObject getSubtitles(String filesHomeName) throws Exception
      {
            //System.out.println("filesHomeName " + filesHomeName);
            File filesHome = new File(filesHomeName);     //NO I18N
            String []extensions={"srt"};  //NO I18N
            boolean recursive =true;
            Collection files= FileUtils.listFiles(filesHome,extensions,recursive);
            JSONObject subtitle = new JSONObject();
            
            JSONObject fileDetails = new JSONObject();
            for(Iterator i=files.iterator();i.hasNext();)
            {
                  File file=(File)i.next();
                  String subtitleName = file.getName().toUpperCase();
                  subtitle.put("SUBTITLE_NAME",subtitleName);
                  String subtitlePath = file.getAbsolutePath();
                  subtitlePath = subtitlePath.replace("G:\\Tom",FILE_PATH);
                  subtitle.put("SUBTITLE_URL",subtitlePath);
                  return subtitle;
            }
            return null;     
      }
}

