using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.Data
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
        public double Radius { get; set; }
    }
}