using EcologyWatcher.Service.Data;
using EcologyWatcher.Service.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace EcologyWatcher.Service
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class Ecology
    {
        ecologyWatchEntities1 db = new ecologyWatchEntities1();
        User_Data currentUser = new User_Data();

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json, UriTemplate = "work/{text}")]
        public string DoWork(string text)
        {
            return text;
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json, UriTemplate = "addwork")]
        public int NewMessage(Message message)
        {
            var accident = new Accident();
            var accident_details = new Accident_Details();

            try
            {
                accident.Status_Id = 1;
                accident.User_Id = 8;
                accident.Situation_Id = message.SituationId + 1;
                accident.Place_Lat = message.Latitude;
                accident.Place_Long = message.Longitude;
                accident.Place_Adress = message.PlaceName;
                db.Accident.Add(accident);

                accident_details.Accident_Id = db.Accident.Count();
                accident_details.Accident_Date = DateTime.Now;
                accident_details.Comments = message.Description;
                accident_details.Relation_Id = 1;
                accident_details.Radius = message.Radius;
                db.Accident_Details.Add(accident_details);

                try
                {
                    db.SaveChanges();
                }
                catch { return -4; }
            }
            catch
            {
                return -2;

            }

            if (accident.Accident_Id > 0)
            {
                return accident.Accident_Id;
            }

            return -3;
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "addnews/{id}")]
        public bool AddNews(string id, Message message)
        {
            var minX = message.Latitude - message.Radius / 111.3;
            var maxX = message.Latitude + message.Radius / 111.3;
            var minY = message.Longitude - message.Radius / (111.3 * Math.Cos(message.Latitude));
            var maxY = message.Longitude + message.Radius / (111.3 * Math.Cos(message.Latitude));

            var accident = db.Accident.Where(a => (a.Place_Lat >= minX) && (a.Place_Lat <= maxX) && (a.Place_Long >= minY) && (a.Place_Long <= maxY)).Last();

            var accident_details = new Accident_Details();

            try
            {
                accident_details.Accident_Date = DateTime.Now;
                accident_details.Comments = message.Description;
                accident_details.Accident_Id = accident.Accident_Id;
                accident_details.Relation_Id = 1;
                accident_details.Radius = message.Radius;
            }
            catch
            {
                return false;
            }

            if (accident.Accident_Id > 0)
            {
                return true;
            }

            return false;
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "remove/{id}")]
        public bool Remove(string id)
        {
            //вижу смысл этого метода, только если пользователь ошибся при внесении данных и хочет их удалить

            var accident = new Accident();

            try
            {
                return true;
            }
            catch { return true; }
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.Wrapped, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "search")]
        public List<Message> Search (DateTime date_from, int start_from)
        {
            List<Message> list = new List<Message>();

            try
            {
                var temp = db.Accident.Join(db.Accident_Details, 
                    ac => ac.Accident_Id, 
                    ad => ad.Accident_Id, 
                    (ac, ad) => new { Accident = ac, Accident_Details = ad}).
                    Where(a => ((a.Accident_Details.Accident_Date == date_from) && (a.Accident.Accident_Id >= start_from))).ToList();

                for (int i = 0; i < temp.Count; i++)
                {
                    list[i].Description = temp[i].Accident_Details.Comments;
                    list[i].SituationId = Convert.ToInt32(temp[i].Accident.Situation_Id);
                    list[i].Latitude = Convert.ToDouble(temp[i].Accident.Place_Lat);
                    list[i].Longitude = Convert.ToDouble(temp[i].Accident.Place_Long);
                    list[i].PlaceName = temp[i].Accident.Place_Adress;
                    list[i].Radius = Convert.ToDouble(temp[i].Accident_Details.Radius);
                }

            }
            catch
            {
                return null;
            }
            return list;
        }

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.WrappedResponse,
            ResponseFormat = WebMessageFormat.Json, UriTemplate = "searchlast10")]
        public List<Message> Search10()
        {
            List<Message> list = new List<Message>();

            try
            {
                var temp = db.Accident.Join(db.Accident_Details,
                   ac => ac.Accident_Id,
                   ad => ad.Accident_Id,
                   (ac, ad) => new { Accident = ac, Accident_Details = ad })
                   .OrderByDescending(a => a.Accident_Details.Accident_Date).Take(10).ToList();

                for (int i = 0; i < temp.Count; i++)
                {
                    list[i].Description = temp[i].Accident_Details.Comments;
                    list[i].SituationId = Convert.ToInt32(temp[i].Accident.Situation_Id);
                    list[i].Latitude = Convert.ToDouble(temp[i].Accident.Place_Lat);
                    list[i].Longitude = Convert.ToDouble(temp[i].Accident.Place_Long);
                    list[i].PlaceName = temp[i].Accident.Place_Adress;
                    list[i].Radius = Convert.ToDouble(temp[i].Accident_Details.Radius);
                }

            }
            catch
            {
                return null;
            }
            return list;
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.Wrapped, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "searchgeo")]
        public List<Message> SearchGeo(string text, double position_lat, double position_long, double radius)
        {
            List<Message> list = new List<Message>();
            var minX = position_lat - radius / 111.3;
            var maxX = position_lat + radius / 111.3;
            var minY = position_long - radius / (111.3 * Math.Cos(position_lat));
            var maxY = position_long + radius / (111.3 * Math.Cos(position_lat));

            try
            {
                var temp = db.Accident.Where(a => (a.Place_Lat >= minX) && (a.Place_Lat <= maxX) && (a.Place_Long >= minY) && (a.Place_Long <= maxY)).ToList();

                for (int i = 0; i < temp.Count; i++)
                {
                    list[i].SituationId = Convert.ToInt32(temp[i].Situation_Id);
                    list[i].Latitude = Convert.ToDouble(temp[i].Place_Lat);
                    list[i].Longitude = Convert.ToDouble(temp[i].Place_Long);
                    list[i].PlaceName = temp[i].Place_Adress;
                }

            }
            catch { }

            return list;
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "login")]
        public int LoginUser(User user)
        {
            try
            {
                currentUser = db.User_Data.Single(u => ((u.Login == user.Login) && (u.Password_Hash == user.Password)));
                return 1;
            }
            catch 
            {
                return -1;
            }
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "create")]
        public int CreateNewUser(NewUser user_data)
        {
            try
            {
                var temp = new User_Data();
                List<User_Data> list = (db.User_Data.Where(u => (u.Login == user_data.Login))).ToList();
                if (list.Count == 0)
                {
                    temp.Login = user_data.Login;
                    temp.Password_Hash = user_data.Password;
                    temp.Email = user_data.Email;
                    temp.Is_Active = true;
                    temp.Joined_On = DateTime.Now;
                    try
                    {
                        db.User_Data.Add(temp);
                        db.SaveChanges();
                    }
                    catch { return -1; }

                    currentUser = temp;
                    return temp.User_Id;
                }
                else return -2;
            }
            catch
            {
                return -3;
            }
        }   
    }
}
