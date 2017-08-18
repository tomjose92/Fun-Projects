package harddisk.browser;
import java.io.IOException;
import java.io.File;
import java.io.FileFilter;
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

public class TVShowsList extends CommonUtil
{
      public static final String DIV_ELEMENT ="\t<div class=\"pt20 ml50 ICON text-nowrap\">TEXT|LINK</div>\n";
      public static final String A_ELEMENT ="<a TAG class=\"SELECTOR ml10 ffFant fs20\">TEXT</a>";
      public static final String SUBTITLE_ICON="\n\t\t\t\t\t<span class=\"space-20\"></span><a href=\"SUBTITLE_URL\"><img class=\"icon\" src=\"img/icons/svg/closed-captioning.svg\"></a>";
      public static final String MOVIE_ICON="\n\t\t\t\t\t<span class=\"space-20\"></span><a href=\"MOVIE_URL\"><img class=\"icon\" src=\"img/icons/svg/tv.svg\"></a>";
      
      public static String tvShowContent = "";
      public static String currentTvShowContent = "";
      public static String tvShowTag = null;
      public static String tvShowSeason = null;
	public static void main(String args[])
	{
		try{
                  if(props.get("TV_SHOW_FOLDER")==null)
                  {
                        System.out.println("Unable to retrieve TV Show folder name from .conf file");
                        return;
                  }
                  listTVShows();
      	}

      	catch(Exception e)
      	{
      		e.printStackTrace();
      	}
	}
      
      public static String listTVShows() throws Exception
      {
            System.out.println("\n******************************* List TV Show Files ******************************");
            String filesHomeName=props.get("TV_SHOW_FOLDER").toString();
            if(!new File(filesHomeName).exists())
            {
                  System.out.println("TV Shows Home Folder not found");
                  return null;
            }

            File[] directories = new File(filesHomeName).listFiles(new FileFilter() {
                  @Override
                  public boolean accept(File file) {
                        return file.isDirectory();
                  }
            });
            JSONArray data =new JSONArray();
            int i=0;
            CommonDBUtil.deleteTableData(TVSHOW_EPISODES_TABLE);
            for(File file:directories)
            {
                  i++;

                  String tvShowName = file.getName();
                  String tvShowPath = file.getAbsolutePath();
                  System.out.println("TV Show : " + file.getName());
                  String fileTag=file.getName().toLowerCase().replaceAll(" ","");
                  String tvShowText = A_ELEMENT.replace("TAG","name=\""+fileTag+"\"")+ "\n";
                  tvShowText=tvShowText.replace("TEXT",file.getName()).replace("SELECTOR","tvshow");
                  String tvShowElement = DIV_ELEMENT;
                  tvShowElement=tvShowElement.replace("ICON","fui-folder").replace("TEXT","\n\t\t" + tvShowText).replace("LINK","SEASON_LINKS");
                  currentTvShowContent+="\n" + tvShowElement;

                  JSONObject json = new JSONObject();
                  json.put("TV_SHOW_ID",i);
                  json.put("TV_SHOW_NAME",tvShowName);
                  json.put("TV_SHOW_TAG",fileTag);

                  data.put(json);
                  tvShowTag = fileTag;
                  listSeasons(tvShowPath);
                  tvShowContent+=currentTvShowContent;
                  currentTvShowContent="";
            }
            tvShowContent = tvShowContent.replaceAll("SEASON_LINKS","\t").replaceAll("LINK","").replaceAll("\\|","").replaceAll("\\*","").replaceAll("\\^","");
            writeFile("TV_SHOW_DIV_ELEMENTS.txt",tvShowContent);
            CommonDBUtil.addTVShowData(data);
            writeFile(REACT_JSON_FOLDER + "tvshow.json",data);
            return tvShowContent;
      }

      public static void listSeasons(String tvShowPath) throws Exception
      {
            File[] directories = new File(tvShowPath).listFiles(new FileFilter() {
                  @Override
                  public boolean accept(File file) {
                        return file.isDirectory();
                  }
            });
            if(directories.length==0)
            {
                  tvShowSeason = "";
                  String episodeElements = listEpisodes(tvShowPath);
                  currentTvShowContent=currentTvShowContent.replace("SEASON_LINKS",episodeElements);
            }
            for(File file:directories)
            {
                  String tvShowSeasonName = file.getName();
                  String tvShowSeasonPath = file.getAbsolutePath();
                  System.out.println("    Season : " + file.getName());

                  String tvShowSeasonText = "\n\t\t\t" + A_ELEMENT.replace("TAG","");
                  tvShowSeasonText=tvShowSeasonText.replace("TEXT",file.getName()).replace("SELECTOR","season");
                  String tvShowSeasonElement = "\t" + DIV_ELEMENT.replace("class","style=\"display:none\" class");

                  tvShowSeason = tvShowSeasonName;
                  String episodeElements = listEpisodes(tvShowSeasonPath);
                  tvShowSeasonElement=tvShowSeasonElement.replace("ICON","fui-radio-checked").replace("TEXT",tvShowSeasonText).replace("LINK",episodeElements+"\n\t\t");
                  currentTvShowContent=currentTvShowContent.replace("SEASON_LINKS",tvShowSeasonElement+"SEASON_LINKS");
            }
      }

      public static String listEpisodes(String tvShowSeasonPath)
      {
            String []extensions={"mkv","mp4","avi","flv"};  //NO I18N
            boolean recursive =true;
            Collection files= FileUtils.listFiles(new File(tvShowSeasonPath),extensions,recursive);
            List <String> fileNames = new ArrayList();
            try{
                  JSONObject fileDetails = new JSONObject();
                  String tvShowEpisodesElement = "";
                  JSONArray episodeData = new JSONArray();
                  for(Iterator i=files.iterator();i.hasNext();)
                  {
                        File file=(File)i.next();
                        fileNames.add(file.getName().toUpperCase());
                        String tvShowEpisodeElement = DIV_ELEMENT;
                        String tvShowEpisodeText = A_ELEMENT;
                        String filePath = file.getAbsolutePath();
                        String subtitleLink = filePath.substring(0,filePath.lastIndexOf("."))+".srt";
                  
                        String movieIcon = MOVIE_ICON;
                        movieIcon = movieIcon.replace("MOVIE_URL",filePath.replace("G:\\Tom",FILE_PATH));
                        String subtitleIcon = SUBTITLE_ICON; 
                        subtitleIcon = subtitleIcon.replace("SUBTITLE_URL",subtitleLink.replace("G:\\Tom",FILE_PATH));

                        String fileName = file.getName();

                        JSONObject json = new JSONObject();
                        json.put("TV_SHOW_TAG",tvShowTag);
                        json.put("TV_SHOW_SEASON",tvShowSeason);
                        json.put("TV_SHOW_EPISODE",fileName);
                        json.put("HAS_SUBTITLE","false");
                        String icons =movieIcon;
                        if(new File(subtitleLink).exists())
                        {
                              json.put("HAS_SUBTITLE","true");
                              icons+=subtitleIcon;
                        }
                        else
                        {
                              if(!file.getAbsolutePath().contains("One Piece") && !file.getAbsolutePath().contains("One Punch Man"))
                              {
                                    System.out.println("          Episodes : " + file.getName());
                              }
                        }

                        if(fileName.length()>50)
                        {
                              tvShowEpisodeText=tvShowEpisodeText.replace("TAG","title=\""+fileName+"\"");
                              fileName=fileName.substring(0,50)+"..";
                        }
                        episodeData.put(json);

                        tvShowEpisodeText = tvShowEpisodeText.replace("TEXT",fileName).replace("SELECTOR","");
                        tvShowEpisodeElement = tvShowEpisodeElement.replace("ICON","fui-arrow-right").replace("TEXT",tvShowEpisodeText).replace("LINK",icons+"\n\t\t\t\t");
                        tvShowEpisodesElement += "\t\t\t" + tvShowEpisodeElement;
                  }
                  CommonDBUtil.addTVShowEpisodeData(episodeData);
                  Collections.sort(fileNames);
                  return "\n\t\t\t<div style=\"display:none\" class=\"episodescroll\">\n"+tvShowEpisodesElement+"<div class=\"pt20\"></div>\t\t\t</div>";
            }
            catch(Exception e){
                  e.printStackTrace();
            }
            return null;
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

