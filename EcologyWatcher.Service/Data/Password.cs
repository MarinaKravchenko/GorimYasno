using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.Data
{
    [DataContract]
    public class Password
    {
        [DataMember]
        public string OldPassword { get; set; }

        [DataMember]
        public string NewPassword { get; set; }

        [DataMember]
        public string ConfirmedPassword { get; set; }
    }
}