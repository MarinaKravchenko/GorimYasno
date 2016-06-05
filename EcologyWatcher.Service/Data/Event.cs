using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.Data
{
    [DataContract]
    public class Event
    {
        [DataMember]
        public string Situation_Name { get; set; }

        [DataMember]
        public string Place_Name { get; set; }

        [DataMember]
        public DateTime Accident_Date { get; set; }
    }
}