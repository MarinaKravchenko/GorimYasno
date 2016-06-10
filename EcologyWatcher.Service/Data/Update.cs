using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.Data
{
    [DataContract]
    public class Update
    {
        [DataMember]
        public int Accident_Id { get; set; }
        [DataMember]
        public double Radius { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public string Accident_Date { get; set; }
        [DataMember]
        public int Relation { get; set; }
    }
}