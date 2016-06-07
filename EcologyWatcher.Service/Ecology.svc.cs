﻿using EcologyWatcher.Service.Data;
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
            ResponseFormat = WebMessageFormat.Json, UriTemplate = "addwork/{session_key}")]
        public int NewMessage(Message message, string session_key)
        {
            try
            {
                var accident = new Accident();
                var accident_details = new Accident_Details();
                var session = db.Session.Where(s => s.Code == session_key).First();
                try
                {
                    accident.Status_Id = 1;
                    accident.User_Id = session.User_Id;
                    accident.Situation_Id = message.SituationId + 1;
                    accident.Place_Lat = message.Latitude;
                    accident.Place_Long = message.Longitude;
                    accident.Place_Adress = message.PlaceName;
                    db.Accident.Add(accident);
                    db.SaveChanges();
                }
                catch
                {
                    return -1;
                }
                try
                {
                    accident_details.Accident_Date = Convert.ToDateTime(message.Accident_Date);
                    accident_details.Accident_Id = accident.Accident_Id;
                    accident_details.Comments = message.Description;
                    accident_details.Relation_Id = message.Relation;
                    accident_details.Radius = message.Radius;
                    db.Accident_Details.Add(accident_details);
                    db.SaveChanges();
                }
                catch
                {
                    return -1;
                }

                if (accident.Accident_Id > 0)
                {
                    return accident.Accident_Id;
                }
                else return -1;
            }
            catch { return -2; }
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "addnews/{session_key}")]
        public int AddNews(Update update, string session_key)
        {
            var accident_details = new Accident_Details();

            try
            {
                var accident = db.Accident.Where(a => a.Accident_Id == update.Accident_Id).ToList();
                //var minX = update.Accident_Id.Latitude - message.Radius / 111.3;
                //var maxX = message.Latitude + message.Radius / 111.3;
                //var minY = message.Longitude - message.Radius / (111.3 * Math.Cos(message.Latitude));
                //var maxY = message.Longitude + message.Radius / (111.3 * Math.Cos(message.Latitude));
                //
                //var accident = db.Accident.Where(a => (a.Place_Lat >= minX) && (a.Place_Lat <= maxX) && (a.Place_Long >= minY) && (a.Place_Long <= maxY)).Last();
                if (accident.Count != 0)
                {
                    accident_details.Accident_Date = update.Accident_Date;
                    accident_details.Comments = update.Description;
                    accident_details.Accident_Id = update.Accident_Id;
                    accident_details.Relation_Id = update.Relation;
                    accident_details.Radius = update.Radius;
                    return 1;
                }
                else
                {
                    return 2;
                }
            }
            catch
            {
                return -1;
            }
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
        public List<string> Search(DateTime date_from)
        {
            List<string> list = new List<string>();
            
            try
            {
                var temp = db.Accident.Join(db.Accident_Details,
                    ac => ac.Accident_Id,
                    ad => ad.Accident_Id,
                    (ac, ad) => new { Accident = ac, Accident_Details = ad }).
                    Where(a => (a.Accident_Details.Accident_Date >= date_from)).ToList();

                for (int i = 0; i < temp.Count; i++)
                {
                    string e = String.Format("{0} {1} {2} {3}", temp[i].Accident.Accident_Id, temp[i].Accident.Situation.Situation_Name, temp[i].Accident.Place_Adress, temp[i].Accident_Details.Accident_Date.ToString());
                    list.Add(e);
                }
            }
            catch
            {
                return null;
            }
            return list;
        }
        
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.Wrapped,
            ResponseFormat = WebMessageFormat.Json, UriTemplate = "searchlast10/{session_key}")]
        public List<string> Search10(string session_key)
        {
            List<string> list = new List<string>();

            try
            {
                var temp = db.Accident.Join(db.Accident_Details,
                   ac => ac.Accident_Id,
                   ad => ad.Accident_Id,
                   (ac, ad) => new { Accident = ac, Accident_Details = ad })
                   .OrderByDescending(a => a.Accident_Details.Accident_Date).Take(10).ToList();

                for (int i = 0; i < temp.Count; i++)
                {
                    string m = String.Format("{0} {1} {2} {3}", temp[i].Accident.Accident_Id, temp[i].Accident.Situation.Situation_Name, temp[i].Accident.Place_Adress, temp[i].Accident_Details.Accident_Date.ToString());
                    list.Add(m);
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
        public string LoginUser(User user)
        {
            Session session = new Session();
            try
            {
                var currentUser = db.User_Data.Where(u => ((u.Login == user.Login) && (u.Password_Hash == user.Password))).ToList();

                if (currentUser.Count != 0)
                {
                    var g = Guid.NewGuid().ToString();
                    session.Code = g;
                    session.User_Id = currentUser.First().User_Id;
                    db.Session.Add(session);
                    db.SaveChanges();
                    return g;
                }
                else
                {
                    return ("Wrong login or password!");
                }
            }
            catch 
            {
                return ("Error!");
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
                    db.User_Data.Add(temp);
                    db.SaveChanges();
                    currentUser = temp;
                    return 1;
                }
                else
                    return 2;
            }
            catch
            {
                return -1;
            }
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "newemail/{session_key}")]
        public int ChangeEmail(Email email, string session_key)
        {
            try
            {
                var temp = db.Session.Join(db.User_Data,
                   ss => ss.User_Id,
                   us => us.User_Id,
                   (ss, us) => new {Session = ss, User_Data = us})
                   .Where(s => s.Session.Code == session_key).First();

                temp.User_Data.Email = email.NewEmail;
                db.SaveChanges();
                return 1;
            }
            catch
            {
                return 0;
            }
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "newpassword/{session_key}")]
        public int ChangePassword(Password password, string session_key)
        {
            try
            {
                var temp = db.Session.Join(db.User_Data,
                   ss => ss.User_Id,
                   us => us.User_Id,
                   (ss, us) => new { Session = ss, User_Data = us })
                   .Where(s => s.Session.Code == session_key).First();

                if (temp.User_Data.Password_Hash == password.OldPassword)
                {
                    if (password.NewPassword == password.ConfirmedPassword)
                    {
                        temp.User_Data.Password_Hash = password.NewPassword;
                        db.SaveChanges();
                        return 1;
                    }
                    else
                        return 2;
                }
                else
                    return 3;
            }
            catch
            {
                return 0;
            }
        }
    }
}
