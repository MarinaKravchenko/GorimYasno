using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.DTO
{
    [DataContract]
    public class Message
    {
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public int SituationId { get; set; }
        [DataMember]
        public double Longitude { get; set; }
        [DataMember]
        public double Latitude { get; set; }
        [DataMember]
        public string PlaceName { get; set; }
        [DataMember]
        public DateTime Accident_Date { get; set; }
        [DataMember]
        public double Radius { get; set; }
        [DataMember]
        public int Relation { get; set; }
        //[DataMember]
        // public byte[] Picture { get; set; }
    }
}