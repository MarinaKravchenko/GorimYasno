using EcologyWatcher.Service.Data;
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
        // To use HTTP GET, add [WebGet] attribute. (Default ResponseFormat is WebMessageFormat.Json)
        // To create an operation that returns XML,
        //     add [WebGet(ResponseFormat=WebMessageFormat.Xml)],
        //     and include the following line in the operation body:
        //         WebOperationContext.Current.OutgoingResponse.ContentType = "text/xml";
        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json, UriTemplate = "work/{text}")]
        public string DoWork(string text)
        {
            return text;
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, UriTemplate = "addwork")]
        public int NewMessage(Message message)
        {
            var accident = new Accident();
            try
            {
                var db = new ecologyWatchEntities();

                accident.Accident_Description = message.Description;
                accident.Status_Id = 1;
                accident.Date = DateTime.Now;
                accident.Place_Lat = message.Latitude;
                accident.Place_Long = message.Longitude;
                accident.Place_Adress = message.PlaceName;
                accident.Situation_Id = message.SituationId;

                db.Accident.Add(accident);
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

            return -1;
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "addnews/{id}")]
        public bool AddNews(string id, Message message)
        {

        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "remove/{id}")]
        public bool Remove(string id)
        {

        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "search")]
        public List<Message> Search(string text, DateTime date_from, int start_from)
        {
            List<Message> list = new List<Message>();

            try
            {
                var db = new ecologyWatchEntities();
                List<Accident> temp = db.Accident.Where(a => ((a.Date >= date_from) && (a.Accident_Id >= start_from))).ToList();

                for (int i = 0; i < temp.Count; i++)
                {
                    list[i].Description = temp[i].Accident_Description;
                    list[i].SituationId = Convert.ToInt32(temp[i].Situation_Id);
                    list[i].Latitude = Convert.ToDouble(temp[i].Place_Lat);
                    list[i].Longitude = Convert.ToDouble(temp[i].Place_Long);
                    list[i].PlaceName = temp[i].Place_Adress;
                }

            }
            catch
            {
            }
            return list;
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
            , ResponseFormat = WebMessageFormat.Json, UriTemplate = "searchlast10")]
        public List<Message> Search10(string text)
        {
            List<Message> list = new List<Message>();

            try
            {
                var db = new ecologyWatchEntities();
                List<Accident> temp = db.Accident.OrderByDescending(a => a.Date).Take(10).ToList();

                for (int i = 0; i < temp.Count; i++)
                {
                    list[i].Description = temp[i].Accident_Description;
                    list[i].SituationId = Convert.ToInt32(temp[i].Situation_Id);
                    list[i].Latitude = Convert.ToDouble(temp[i].Place_Lat);
                    list[i].Longitude = Convert.ToDouble(temp[i].Place_Long);
                    list[i].PlaceName = temp[i].Place_Adress;
                }

            }
            catch
            {
            }
            return list;
        }

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedResponse, RequestFormat = WebMessageFormat.Json
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
                var db = new ecologyWatchEntities();
                List<Accident> temp = db.Accident.Where(a => (a.Place_Lat >= minX) && (a.Place_Lat <= maxX) && (a.Place_Long >= minY) && (a.Place_Long <= maxY)).ToList();
                for (int i = 0; i < temp.Count; i++)
                {
                    list[i].Description = temp[i].Accident_Description;
                    list[i].SituationId = Convert.ToInt32(temp[i].Situation_Id);
                    list[i].Latitude = Convert.ToDouble(temp[i].Place_Lat);
                    list[i].Longitude = Convert.ToDouble(temp[i].Place_Long);
                    list[i].PlaceName = temp[i].Place_Adress;
                }
            }
            catch { }

            return list;
        }
    }
}
