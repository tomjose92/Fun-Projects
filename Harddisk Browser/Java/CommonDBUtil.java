package harddisk.browser;

import org.json.JSONObject;
import org.json.JSONArray;
import java.sql.ResultSet;  
import java.sql.Statement;  
import java.sql.Connection;  
import java.sql.DriverManager;
import java.sql.PreparedStatement;    

import java.util.Properties; 

import java.io.File;

class CommonDBUtil extends MediaConstants{  
	public static void main(String args[]){  
		dumpMySqlData();
	}  

	public static String addMovieData(JSONArray data)
	{
		String status="failure";
		try{
			String tableName = MOVIES_TABLE;
			deleteTableData(tableName);

			Class.forName("com.mysql.jdbc.Driver");  
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/harddiskbrowser","root","root");  

			String queryDelete = " delete from " + tableName;
			PreparedStatement deletingStatement = con.prepareStatement(queryDelete);
			deletingStatement.execute();
			
			String id="MOVIE_ID";
			String name="MOVIE_NAME";
			String hasSubtitle="HAS_SUBTITLE";
			String letter = "LETTER";
      		String queryAdd = " insert into "+tableName+" ("+id+", "+name+", " + letter +", "+hasSubtitle+")" + " values (?, ?, ?, ?)";

			for(int i=0;i<data.length();i++)
			{
				JSONObject json = data.getJSONObject(i);

   				PreparedStatement preparedStmt = con.prepareStatement(queryAdd);
   				preparedStmt.setInt (1,json.getInt(id));
   				preparedStmt.setString (2, json.getString(name));
   				preparedStmt.setString (3, json.getString(letter));
   				preparedStmt.setString (4, json.getString(hasSubtitle));
   				preparedStmt.execute();
      		}

			con.close();  
			status="success";
		}catch(Exception e){ System.out.println("Exception occurred in addMovieData()" +  e);}  
		return status;
	}

	public static String addTVShowData(JSONArray data)
	{
		String status="failure";
		try{
			String tableName = TVSHOWS_TABLE;	  
			deleteTableData(tableName);

			Class.forName("com.mysql.jdbc.Driver");  
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/harddiskbrowser","root","root");  
			
			String id="TV_SHOW_ID";
			String name="TV_SHOW_NAME";
			String tag = "TV_SHOW_TAG";
      		String queryAdd = " insert into "+tableName+" ("+id+", "+name+", " + tag +")" + " values (?, ?, ?)";

			for(int i=0;i<data.length();i++)
			{
				JSONObject json = data.getJSONObject(i);

   				PreparedStatement preparedStmt = con.prepareStatement(queryAdd);
   				preparedStmt.setInt (1,json.getInt(id));
   				preparedStmt.setString (2, json.getString(name));
   				preparedStmt.setString (3, json.getString(tag));
   				preparedStmt.execute();
      		}

			con.close();  
			status="success";
		}catch(Exception e){ System.out.println("Exception occurred in addTVShowData()" +  e);}  
		return status;
	}

	public static String addTVShowEpisodeData(JSONArray data)
	{
		String status="failure";
		try{
			String tableName =  TVSHOW_EPISODES_TABLE;

			Class.forName("com.mysql.jdbc.Driver");  
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/harddiskbrowser","root","root");  
			
			String tag = "TV_SHOW_TAG";
			String season="TV_SHOW_SEASON";
			String episode="TV_SHOW_EPISODE";
			String hasSubtitle="HAS_SUBTITLE";
			
      		String queryAdd = " insert into "+tableName+" ("+tag+", "+season+", " + episode +", "+hasSubtitle +")" + " values (?, ?, ?, ?)";

			for(int i=0;i<data.length();i++)
			{
				JSONObject json = data.getJSONObject(i);

   				PreparedStatement preparedStmt = con.prepareStatement(queryAdd);
   				preparedStmt.setString (1, json.getString(tag));
   				preparedStmt.setString (2, json.getString(season));
   				preparedStmt.setString (3, json.getString(episode));
   				preparedStmt.setString (4, json.getString(hasSubtitle));
   				preparedStmt.execute();
      		}

			con.close();  
			status="success";
		}catch(Exception e){ System.out.println("Exception occurred in addTVShowEpisodeData()" +  e);}  
		return status;
	}

	public static void deleteTableData(String tableName)
	{
		try{
			Class.forName("com.mysql.jdbc.Driver");  
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/harddiskbrowser","root","root");  

			String queryDelete = " delete from " + tableName;
			PreparedStatement deletingStatement = con.prepareStatement(queryDelete);
			deletingStatement.execute();	

			con.close();  
		}catch(Exception e){ System.out.println("Exception occurred in deleteTableData()" +  e);}  
	}

	public static void displayTableData(String tableName)
	{
		try
		{
			Class.forName("com.mysql.jdbc.Driver");  
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/harddiskbrowser","root","root");  
			Statement stmt=con.createStatement();  
			ResultSet rs=stmt.executeQuery("select * from "+tableName);  
			while(rs.next()){  
				System.out.println(rs.toString());  
			}
			con.close();  
		}catch(Exception e){ System.out.println(e);}  
	}

	public static void dumpMySqlData()
	{
		String location = SQL_DUMP_COMMAND_LINUX;
		System.out.println(new File(location).exists());		
		CommonUtil.process(location);
	}
}  
