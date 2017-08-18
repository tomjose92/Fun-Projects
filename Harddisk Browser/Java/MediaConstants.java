package harddisk.browser;

import java.io.File;

public class MediaConstants
{
	public static final String MEDIA_CONSTANTS = "MEDIA_CONSTANTS.conf";

    public static final String MOVIE_HTML_PATH = ".."+ File.separator + "Flat-UI-master" + File.separator + "movies.html";
    public static final String TV_SHOW_HTML_PATH = ".."+ File.separator + "Flat-UI-master" + File.separator + "tvseries.html";
    
    public static final String SQL_DUMP_COMMAND = "sql\\dumpSQLData.bat";
    public static final String SQL_DUMP_COMMAND_LINUX = ".\\sql\\dumpSQLDataLinux";

    public static final String MOVIES_TABLE = "movies";
    public static final String TVSHOWS_TABLE = "tvshows";
    public static final String TVSHOW_EPISODES_TABLE = "tvshowepisodes";

    public static final String REACT_JSON_FOLDER = "../Flat-UI-master/ReactJS Browser/src/client/json/";
}

