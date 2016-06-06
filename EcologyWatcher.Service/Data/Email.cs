using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.Data
{
    [DataContract]
    public class Email
    {
        [DataMember]
        public string NewEmail { get; set; }
    }
}