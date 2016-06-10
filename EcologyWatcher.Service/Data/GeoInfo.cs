using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.Data
{
    [DataContract]
    public class GeoInfo
    {
        [DataMember]
        public double Position_Lat { get; set; }
        [DataMember]
        public double Position_Long { get; set; }
        [DataMember]
        public string Address { get; set; }
        [DataMember]
        public double Radius { get; set; }
    }
}